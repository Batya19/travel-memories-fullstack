using Microsoft.EntityFrameworkCore;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Models;
using TravelMemories.Data.Context;

namespace TravelMemories.Data.Repositories
{
    public class ImageRepository : Repository<Image>, IImageRepository
    {
        public ImageRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Image> GetImageWithDetailsAsync(Guid imageId)
        {
            return await _context.Images
                .Include(i => i.Trip)
                .Include(i => i.User)
                .Include(i => i.ImageTags)
                .ThenInclude(it => it.Tag)
                .SingleOrDefaultAsync(i => i.Id == imageId);
        }

        public async Task<IEnumerable<Image>> GetImagesByTripAsync(Guid tripId)
        {
            Console.WriteLine($"DEBUG: Fetching images for trip ID: {tripId}");
            var images = await _context.Images
                .Include(i => i.ImageTags)
                .ThenInclude(it => it.Tag)
                .Where(i => i.TripId == tripId)
                .OrderBy(i => i.TakenAt)
                .ToListAsync();

            Console.WriteLine($"DEBUG: Found {images.Count()} images for trip ID: {tripId}");
            foreach (var img in images)
            {
                Console.WriteLine($"DEBUG: Image {img.Id} - TripId: {img.TripId}");
            }

            return images;
        }

        public async Task<IEnumerable<Image>> GetAiGeneratedImagesAsync(Guid userId)
        {
            return await _context.Images
                .Where(i => i.UserId == userId && i.IsAiGenerated)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }
    }
}