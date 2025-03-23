using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces.Repositories
{
    public interface IAIImageRepository : IRepository<Image>
    {
        Task<IEnumerable<Image>> GetAIGeneratedImagesAsync(Guid userId);
        Task<int> GetMonthlyGenerationCountAsync(Guid userId, DateTime monthStart);
        Task<Image> GetAIImageWithDetailsAsync(Guid imageId);
    }
}
