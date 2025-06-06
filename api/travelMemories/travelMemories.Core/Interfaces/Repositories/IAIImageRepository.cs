﻿using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces.Repositories
{
    public interface IAIImageRepository : IRepository<Image>
    {
        Task<IEnumerable<Image>> GetAIGeneratedImagesAsync(Guid userId);
        Task<int> GetMonthlyGenerationCountAsync(Guid userId, DateTime monthStart);
        Task<Image> GetAIImageWithDetailsAsync(Guid imageId);
    }
}
