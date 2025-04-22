using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TravelMemories.Core.DTOs.AIImage;
using TravelMemories.Core.Interfaces.External;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;

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
        _huggingFaceClient = huggingFaceClient;
        _s3Service = s3Service;
        _imageRepository = imageRepository;
        _userRepository = userRepository;
        _configuration = configuration;
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
        // בדיקת מכסה
        if (!await CheckUserQuotaAsync(userId))
        {
            throw new InvalidOperationException("AI image generation quota exceeded");
        }

        try
        {
            // יצירת תמונה באמצעות הhuggingFaceClient
            byte[] imageBytes = await _huggingFaceClient.GenerateImageAsync(
                request.Prompt,
                request.Style
            );

            if (imageBytes == null || imageBytes.Length == 0)
            {
                throw new InvalidOperationException("Generated image data is empty");
            }

            // יצירת שם קובץ וקביעת סוג תוכן
            var fileName = $"{Guid.NewGuid()}.png";
            var contentType = "image/png";

            // העלאה ל-S3
            var folderName = $"users/{userId}/ai-images";

            // המרת מערך בתים ל-IFormFile להעלאה ל-S3
            using (var memoryStream = new MemoryStream(imageBytes))
            {
                var formFile = new FormFile(
                    baseStream: memoryStream,
                    baseStreamOffset: 0,
                    length: imageBytes.Length,
                    name: "file",
                    fileName: fileName
                );

                // העלאה ל-S3
                var filePath = await _s3Service.UploadFileAsync(formFile, folderName, fileName);

                // יצירת אובייקט תמונה
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

                // שמירה במסד הנתונים
                await _imageRepository.AddAsync(image);

                return image;
            }
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Error calling Hugging Face API: {ex.Message}");
            throw new InvalidOperationException($"Failed to generate AI image: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in AIImageService.GenerateImageAsync: {ex.Message}");
            throw new InvalidOperationException($"Failed to process AI image: {ex.Message}", ex);
        }
    }
}