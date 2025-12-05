using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces.Repositories
{
    public interface IImageRepository : IRepository<Image>
    {
        Task<Image> GetImageWithDetailsAsync(Guid imageId);
        Task<IEnumerable<Image>> GetImagesByTripAsync(Guid tripId);
        Task<IEnumerable<Image>> GetAiGeneratedImagesAsync(Guid userId);
    }
}
