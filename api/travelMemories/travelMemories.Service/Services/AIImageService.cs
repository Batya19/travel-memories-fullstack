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
        private readonly IImageRepository _imageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AIImageService(
            IHuggingFaceClient huggingFaceClient,
            IS3Service s3Service,
            IImageRepository imageRepository,
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _huggingFaceClient = huggingFaceClient ?? throw new ArgumentNullException(nameof(huggingFaceClient));
            _s3Service = s3Service ?? throw new ArgumentNullException(nameof(s3Service));
            _imageRepository = imageRepository ?? throw new ArgumentNullException(nameof(imageRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<bool> CheckUserQuotaAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found");
            }

            int usedCount = await GetUserAiGenerationCountAsync(userId);
            return usedCount < user.AiQuota;
        }

        public async Task<int> GetUserAiGenerationCountAsync(Guid userId)
        {
            var now = DateTime.UtcNow;
            // Create DateTimes with explicit UTC kind
            var startOfMonth = DateTime.SpecifyKind(new DateTime(now.Year, now.Month, 1), DateTimeKind.Utc);
            var endOfMonth = DateTime.SpecifyKind(startOfMonth.AddMonths(1).AddDays(-1), DateTimeKind.Utc);

            return await _imageRepository.CountAsync(i =>
                i.UserId == userId &&
                i.IsAiGenerated &&
                i.CreatedAt >= startOfMonth &&
                i.CreatedAt <= endOfMonth);
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

            // Check quota
            if (!await CheckUserQuotaAsync(userId))
            {
                Console.WriteLine($"[AIImageService] AI quota exceeded for user {userId}");
                throw new InvalidOperationException("AI image generation quota exceeded");
            }

            try
            {
                // Generate image using huggingFaceClient
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

                // Create filename and set content type
                var fileName = $"{Guid.NewGuid()}.png";
                var contentType = "image/png";
                Console.WriteLine($"[AIImageService] Created filename: {fileName}, content type: {contentType}");

                // Upload to S3
                var folderName = $"users/{userId}/ai-images";
                Console.WriteLine($"[AIImageService] Target S3 folder: {folderName}");

                string filePath;
                // Convert byte array to IFormFile for S3 upload
                using (var memoryStream = new MemoryStream(imageBytes))
                {
                    // Ensure the stream position is at the beginning
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

                    // Upload to S3
                    Console.WriteLine($"[AIImageService] Uploading to S3...");
                    filePath = await _s3Service.UploadFileAsync(formFile, folderName, fileName);
                    Console.WriteLine($"[AIImageService] Upload to S3 successful, file path: {filePath}");
                }

                // Create image object
                var image = new Image
                {
                    Id = Guid.NewGuid(),
                    FileName = fileName,
                    FilePath = filePath,
                    FileSize = imageBytes.Length,
                    MimeType = contentType,
                    TripId = request.TripId,
                    IsAiGenerated = true,
                    AiPrompt = request.Prompt,
                    AiStyle = request.Style,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId
                };

                Console.WriteLine($"[AIImageService] Created image record: Id={image.Id}, FilePath={image.FilePath}");

                // Save to database
                await _imageRepository.AddAsync(image);
                await _imageRepository.SaveChangesAsync();
                Console.WriteLine($"[AIImageService] Saved image record to database successfully");

                // After saving, verify the image exists in S3
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
                    // Don't throw here, just log the warning
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
    }
}