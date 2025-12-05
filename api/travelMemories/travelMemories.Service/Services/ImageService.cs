using TravelMemories.Core.Interfaces.External;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;
using TravelMemories.Core.DTOs.Image;
using TravelMemories.Service.Helpers;

namespace TravelMemories.Service.Services
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly ITagRepository _tagRepository;
        private readonly ITripRepository _tripRepository;
        private readonly IUserService _userService;
        private readonly IS3Service _s3Service;

        public ImageService(
            IImageRepository imageRepository,
            ITagRepository tagRepository,
            ITripRepository tripRepository,
            IUserService userService,
            IS3Service s3Service)
        {
            _imageRepository = imageRepository;
            _tagRepository = tagRepository;
            _tripRepository = tripRepository;
            _userService = userService;
            _s3Service = s3Service;
        }

        public async Task<IEnumerable<Image>> UploadImagesAsync(Guid userId, ImageUploadRequest request)
        {
            var totalSize = request.Files.Sum(f => f.Length);

            if (!await _userService.CheckStorageQuotaAsync(userId, (int)totalSize))
            {
                throw new InvalidOperationException("Storage quota exceeded");
            }

            if (request.TripId.HasValue)
            {
                var trip = await _tripRepository.GetByIdAsync(request.TripId.Value);

                if (trip == null)
                {
                    throw new InvalidOperationException("Trip not found");
                }

                if (trip.UserId != userId)
                {
                    throw new UnauthorizedAccessException("You do not have permission to add images to this trip");
                }
            }

            var uploadedImages = new List<Image>();

            foreach (var file in request.Files)
            {
                if (file.Length == 0)
                {
                    continue;
                }

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!IsValidImageExtension(extension))
                {
                    throw new InvalidOperationException($"File type not supported: {extension}");
                }

                var folderName = $"users/{userId}/images";
                var s3Path = await _s3Service.UploadFileAsync(file, folderName);

                var image = new Image
                {
                    FileName = file.FileName,
                    FilePath = s3Path,
                    FileSize = (int)file.Length,
                    MimeType = file.ContentType,
                    TripId = request.TripId,
                    UserId = userId,
                    TakenAt = ImageHelper.GetImageTakenDate(file),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId
                };

                await _imageRepository.AddAsync(image);
                uploadedImages.Add(image);
            }

            await _imageRepository.SaveChangesAsync();

            if (request.Tags != null && request.Tags.Length > 0 && uploadedImages.Count > 0)
            {
                await ProcessTagsAsync(uploadedImages, request.Tags, userId);
            }

            return uploadedImages;
        }

        public async Task<Image?> GetImageByIdAsync(Guid imageId, Guid? userId = null)
        {
            Image? image = await _imageRepository.GetImageWithDetailsAsync(imageId);

            if (image == null)
            {
                return null;
            }

            if (userId.HasValue)
            {
                if (image.UserId != userId.Value &&
                    (image.TripId == null ||
                    (image.Trip != null && image.Trip.UserId != userId.Value && image.Trip.ShareId == null)))
                {
                    throw new UnauthorizedAccessException("You do not have permission to view this image");
                }
            }

            return image;
        }

        public async Task<bool> DeleteImageAsync(Guid imageId, Guid userId)
        {
            var image = await _imageRepository.GetByIdAsync(imageId);

            if (image == null)
            {
                return false;
            }

            if (image.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have permission to delete this image");
            }

            await _s3Service.DeleteFileAsync(image.FilePath);
            _imageRepository.Remove(image);
            await _imageRepository.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Image>> GetImagesByTripAsync(Guid tripId, Guid userId)
        {
            var trip = await _tripRepository.GetByIdAsync(tripId);

            if (trip == null)
            {
                throw new InvalidOperationException("Trip not found");
            }

            if (trip.UserId != userId && trip.ShareId == null)
            {
                throw new UnauthorizedAccessException("You do not have permission to view images for this trip");
            }

            return await _imageRepository.GetImagesByTripAsync(tripId);
        }

        public async Task<byte[]?> DownloadImageAsync(Guid imageId, Guid? userId = null)
        {
            Image? image = await _imageRepository.GetByIdAsync(imageId);

            if (image == null)
            {
                return null;
            }

            if (userId.HasValue)
            {
                Trip? trip = image.TripId.HasValue ? await _tripRepository.GetByIdAsync(image.TripId.Value) : null;

                if (image.UserId != userId.Value && (trip == null || (trip.UserId != userId.Value && trip.ShareId == null)))
                {
                    throw new UnauthorizedAccessException("You do not have permission to download this image");
                }
            }
            else
            {
                if (!image.TripId.HasValue)
                {
                    throw new UnauthorizedAccessException("This image is not publicly accessible");
                }

                Trip? trip = await _tripRepository.GetByIdAsync(image.TripId.Value);
                if (trip == null || trip.ShareId == null)
                {
                    throw new UnauthorizedAccessException("This image is not publicly accessible");
                }
            }

            return await _s3Service.DownloadFileAsync(image.FilePath);
        }

        #region Helper Methods

        private bool IsValidImageExtension(string extension)
        {
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".tif" };
            return validExtensions.Contains(extension);
        }

        private async Task ProcessTagsAsync(List<Image> images, string[] tagNames, Guid userId)
        {
            var existingTags = await _tagRepository.GetByNamesAsync(tagNames);
            var existingTagNames = existingTags.Select(t => t.Name.ToLower()).ToList();

            var newTags = new List<Tag>();
            foreach (var tagName in tagNames)
            {
                if (!existingTagNames.Contains(tagName.ToLower()))
                {
                    var tag = new Tag
                    {
                        Name = tagName.Trim(),
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = userId
                    };

                    await _tagRepository.AddAsync(tag);
                    newTags.Add(tag);
                }
            }

            await _tagRepository.SaveChangesAsync();

            var allTags = existingTags.Concat(newTags).ToList();

            foreach (var image in images)
            {
                foreach (var tag in allTags)
                {
                    await _tagRepository.AddTagToImageAsync(image.Id, tag.Id, userId);
                }
            }
        }

        #endregion
    }
}