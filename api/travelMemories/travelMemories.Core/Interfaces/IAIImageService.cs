using System;
using System.Threading.Tasks;
using TravelMemories.Core.DTOs.AIImage;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces
{
    public interface IAIImageService
    {
        Task<bool> CheckUserQuotaAsync(Guid userId);
        Task<int> GetUserAiGenerationCountAsync(Guid userId);
        Task<Image> GenerateImageAsync(Guid userId, AIImageRequest request);
        Task<IEnumerable<Image>> GetAiImagesForUserAsync(Guid userId);
    }
}