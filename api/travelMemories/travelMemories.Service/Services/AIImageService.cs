using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<AIImageService> _logger;

        public AIImageService(
            IHuggingFaceClient huggingFaceClient,
            IS3Service s3Service,
            IAIImageRepository aiImageRepository,
            IUserRepository userRepository,
            IConfiguration configuration,
            ILogger<AIImageService> logger)
        {
            _huggingFaceClient = huggingFaceClient ?? throw new ArgumentNullException(nameof(huggingFaceClient));
            _s3Service = s3Service ?? throw new ArgumentNullException(nameof(s3Service));
            _aiImageRepository = aiImageRepository ?? throw new ArgumentNullException(nameof(aiImageRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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

            _logger.LogInformation("Starting AI image generation for user {UserId}, prompt: '{Prompt}', style: '{Style}'", userId, request.Prompt, request.Style);

            if (!await CheckUserQuotaAsync(userId))
            {
                _logger.LogWarning("AI quota exceeded for user {UserId}", userId);
                throw new InvalidOperationException("AI image generation quota exceeded");
            }

            try
            {
                _logger.LogInformation("Calling HuggingFace API to generate image");
                byte[] imageBytes = await _huggingFaceClient.GenerateImageAsync(
                    request.Prompt,
                    request.Style
                );

                if (imageBytes == null || imageBytes.Length == 0)
                {
                    _logger.LogError("HuggingFace API returned empty data");
                    throw new InvalidOperationException("Generated image data is empty");
                }

                _logger.LogInformation("Image generated successfully, bytes length: {Length}", imageBytes.Length);

                var fileName = $"{Guid.NewGuid()}.png";
                var contentType = "image/png";
                var folderName = $"users/{userId}/ai-images";

                string filePath;
                using (var memoryStream = new MemoryStream(imageBytes))
                {
                    memoryStream.Position = 0;

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

                    _logger.LogInformation("Uploading AI image to S3: {FileName}", fileName);
                    filePath = await _s3Service.UploadFileAsync(formFile, folderName, fileName);
                    _logger.LogInformation("Upload to S3 successful, file path: {FilePath}", filePath);
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

                await _aiImageRepository.AddAsync(image); 
                await _aiImageRepository.SaveChangesAsync(); 
                _logger.LogInformation("Saved AI image record to database: ImageId={ImageId}, FilePath={FilePath}", image.Id, image.FilePath);

                try
                {
                    var testBytes = await _s3Service.DownloadFileAsync(filePath);
                    if (testBytes != null && testBytes.Length > 0)
                    {
                        _logger.LogDebug("Image verified in S3, byte length: {Length}", testBytes.Length);
                    }
                    else
                    {
                        _logger.LogWarning("Image verification returned empty data for file: {FilePath}", filePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to verify image in S3: {FilePath}", filePath);
                }

                return image;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error calling Hugging Face API");
                throw new InvalidOperationException($"Failed to generate AI image: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AIImageService.GenerateImageAsync");
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