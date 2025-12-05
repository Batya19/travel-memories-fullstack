using TravelMemories.Core.DTOs.Image;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces
{
    public interface IImageService
    {
        Task<IEnumerable<Image>> UploadImagesAsync(Guid userId, ImageUploadRequest request);
        Task<Image> GetImageByIdAsync(Guid imageId, Guid userId);
        Task<bool> DeleteImageAsync(Guid imageId, Guid userId);
        Task<IEnumerable<Image>> GetImagesByTripAsync(Guid tripId, Guid userId);
        Task<byte[]> DownloadImageAsync(Guid imageId, Guid userId);
    }
}