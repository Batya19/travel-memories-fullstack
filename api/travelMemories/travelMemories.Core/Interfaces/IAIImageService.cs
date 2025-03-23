using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.DTOs.AIImage;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces
{
    public interface IAIImageService
    {
        Task<Image> GenerateImageAsync(Guid userId, AIImageRequest request);
        Task<bool> CheckUserQuotaAsync(Guid userId);
        Task<int> GetUserAiGenerationCountAsync(Guid userId);
    }
}