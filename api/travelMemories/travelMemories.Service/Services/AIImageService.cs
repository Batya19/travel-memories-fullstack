using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TravelMemories.Core.DTOs.AIImage;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Interfaces.External;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Models;

namespace TravelMemories.Service.Services
{
    public class AIImageService : IAIImageService
    {
        private readonly IHuggingFaceClient _huggingFaceClient;
        private readonly IS3Service _s3Service;
        private readonly IAIImageRepository _aiImageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AIImageService(
            IHuggingFaceClient huggingFaceClient,
            IS3Service s3Service,
            IAIImageRepository aiImageRepository,
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _huggingFaceClient = huggingFaceClient ?? throw new ArgumentNullException(nameof(huggingFaceClient));
            _s3Service = s3Service ?? throw new ArgumentNullException(nameof(s3Service));
            _aiImageRepository = aiImageRepository ?? throw new ArgumentNullException(nameof(aiImageRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<bool> CheckUserQuotaAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found."); 
            }

            var usedCount = await GetUserAiGenerationCountAsync(userId);
            return user.AiQuota > usedCount;
        }

        public async Task<int> GetUserAiGenerationCountAsync(Guid userId)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc); 

            return await _aiImageRepository.GetMonthlyGenerationCountAsync(userId, monthStart);
        }

        public async Task<Image> GenerateImageAsync(Guid userId, AIImageRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request), "AI image request cannot be null");
            }

            if (string.IsNullOrEmpty(request.Prompt))
            {
                throw new ArgumentException("Prompt cannot be empty", nameof(request.Prompt));
            }

            if (request.TripId == Guid.Empty)
            {
                throw new ArgumentException("Trip ID cannot be empty", nameof(request.TripId));
            }

            Console.WriteLine($"[AIImageService] Starting AI image generation for user {userId}, prompt: '{request.Prompt}', style: '{request.Style}'");

            if (!await CheckUserQuotaAsync(userId))
            {
                Console.WriteLine($"[AIImageService] AI quota exceeded for user {userId}");
                throw new InvalidOperationException("AI image generation quota exceeded");
            }

            try
            {
                Console.WriteLine($"[AIImageService] Calling HuggingFace API to generate image...");
                byte[] imageBytes = await _huggingFaceClient.GenerateImageAsync(
                    request.Prompt,
                    request.Style
                );

                if (imageBytes == null || imageBytes.Length == 0)
                {
                    Console.WriteLine($"[AIImageService] HuggingFace API returned empty data");
                    throw new InvalidOperationException("Generated image data is empty");
                }

                Console.WriteLine($"[AIImageService] Image generated successfully, bytes length: {imageBytes.Length}");

                var fileName = $"{Guid.NewGuid()}.png";
                var contentType = "image/png";
                Console.WriteLine($"[AIImageService] Created filename: {fileName}, content type: {contentType}");

                var folderName = $"users/{userId}/ai-images";
                Console.WriteLine($"[AIImageService] Target S3 folder: {folderName}");

                string filePath;
                using (var memoryStream = new MemoryStream(imageBytes))
                {
                    memoryStream.Position = 0;
                    Console.WriteLine($"[AIImageService] Created MemoryStream from image bytes, length: {memoryStream.Length}");

                    var formFile = new FormFile(
                        baseStream: memoryStream,
                        baseStreamOffset: 0,
                        length: imageBytes.Length,
                        name: "file",
                        fileName: fileName
                    )
                    {
                        Headers = new HeaderDictionary(),
                        ContentType = contentType
                    };

                    Console.WriteLine($"[AIImageService] Created FormFile: {fileName}, ContentType: {contentType}, Length: {formFile.Length}");

                    Console.WriteLine($"[AIImageService] Uploading to S3...");
                    filePath = await _s3Service.UploadFileAsync(formFile, folderName, fileName);
                    Console.WriteLine($"[AIImageService] Upload to S3 successful, file path: {filePath}");
                }

                var image = new Image
                {
                    Id = Guid.NewGuid(),
                    FileName = fileName,
                    FilePath = filePath,
                    FileSize = imageBytes.Length,
                    MimeType = contentType,
                    TripId = request.TripId == Guid.Empty ? (Guid?)null : request.TripId, 
                    IsAiGenerated = true,
                    AiPrompt = request.Prompt,
                    AiStyle = request.Style,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId
                };

                Console.WriteLine($"[AIImageService] Created image record: Id={image.Id}, FilePath={image.FilePath}");

                await _aiImageRepository.AddAsync(image); 
                await _aiImageRepository.SaveChangesAsync(); 
                Console.WriteLine($"[AIImageService] Saved image record to database successfully");

                try
                {
                    Console.WriteLine($"[AIImageService] Verifying image exists in S3...");
                    var testBytes = await _s3Service.DownloadFileAsync(filePath);
                    if (testBytes != null && testBytes.Length > 0)
                    {
                        Console.WriteLine($"[AIImageService] Image verified in S3, byte length: {testBytes.Length}");
                    }
                    else
                    {
                        Console.WriteLine($"[AIImageService] WARNING: Image verification returned empty data");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[AIImageService] WARNING: Failed to verify image in S3: {ex.Message}");
                }

                return image;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"[AIImageService] Error calling Hugging Face API: {ex.Message}");
                Console.WriteLine($"[AIImageService] Stack trace: {ex.StackTrace}");
                throw new InvalidOperationException($"Failed to generate AI image: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AIImageService] Error in AIImageService.GenerateImageAsync: {ex.Message}");
                Console.WriteLine($"[AIImageService] Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[AIImageService] Inner exception: {ex.InnerException.Message}");
                }
                throw new InvalidOperationException($"Failed to process AI image: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Image>> GetAiImagesForUserAsync(Guid userId)
        {
            var images = await _aiImageRepository.GetAIGeneratedImagesAsync(userId);
            return images;
        }
    }
}