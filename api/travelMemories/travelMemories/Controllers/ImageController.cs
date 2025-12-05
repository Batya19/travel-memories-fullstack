using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelMemories.Core.DTOs;
using TravelMemories.Core.DTOs.Image;
using TravelMemories.Core.DTOs.Tag;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;

namespace TravelMemories.Controllers
{
    [ApiController]
    [Route("api/images")]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet("{id}/content")]
        [AllowAnonymous]
        public async Task<ActionResult> GetImageContent(Guid id)
        {
            Console.WriteLine($"[ImageController] GetImageContent called for image ID: {id}");

            Guid? userId = null;

            if (User.Identity.IsAuthenticated)
            {
                userId = GetUserId();
                Console.WriteLine($"[ImageController] Authenticated user ID: {userId}");
            }
            else
            {
                Console.WriteLine("[ImageController] Request from unauthenticated user");
            }

            try
            {
                // Get image details first to log the expected file path
                var image = await _imageService.GetImageByIdAsync(id, userId ?? Guid.Empty);

                if (image == null)
                {
                    Console.WriteLine($"[ImageController] Image with ID {id} not found");
                    return NotFound(ErrorDto.NotFound("Image not found"));
                }

                Console.WriteLine($"[ImageController] Found image: ID={id}, FilePath={image.FilePath}, MimeType={image.MimeType}, IsAiGenerated={image.IsAiGenerated}");

                // Download the image bytes
                var imageBytes = await _imageService.DownloadImageAsync(id, userId ?? Guid.Empty);

                if (imageBytes == null || imageBytes.Length == 0)
                {
                    Console.WriteLine($"[ImageController] No image data returned for image ID {id}");
                    return NotFound(ErrorDto.NotFound("Image data not found"));
                }

                Console.WriteLine($"[ImageController] Successfully downloaded image data: {imageBytes.Length} bytes");

                return File(imageBytes, image.MimeType);
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"[ImageController] InvalidOperationException: {ex.Message}");
                Console.WriteLine($"[ImageController] Stack trace: {ex.StackTrace}");
                return BadRequest(ErrorDto.FromException(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"[ImageController] KeyNotFoundException: {ex.Message}");
                return NotFound(ErrorDto.NotFound("Image not found"));
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"[ImageController] UnauthorizedAccessException: {ex.Message}");
                return Forbid();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ImageController] Unhandled exception: {ex.Message}");
                Console.WriteLine($"[ImageController] Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[ImageController] Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, ErrorDto.FromException("An error occurred while retrieving the image"));
            }
        }

        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<ImageResponse>>> GetTripImages(Guid tripId)
        {
            var userId = GetUserId();

            try
            {
                var images = await _imageService.GetImagesByTripAsync(tripId, userId);
                return Ok(images.Select(MapToImageResponse));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ErrorDto.FromException(ex.Message));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPost("upload")]
        public async Task<ActionResult<IEnumerable<ImageResponse>>> UploadImages([FromForm] ImageUploadRequest request)
        {
            if (request.Files == null || request.Files.Length == 0)
            {
                return BadRequest(ErrorDto.ValidationError("No files were uploaded"));
            }

            var userId = GetUserId();

            try
            {
                var images = await _imageService.UploadImagesAsync(userId, request);
                return Ok(images.Select(MapToImageResponse));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ErrorDto.FromException(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteImage(Guid id)
        {
            var userId = GetUserId();

            try
            {
                var result = await _imageService.DeleteImageAsync(id, userId);

                if (!result)
                {
                    return NotFound(ErrorDto.NotFound("Image not found"));
                }

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        #region Helper Methods

        private Guid GetUserId()
        {
            return Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
        }

        private ImageResponse MapToImageResponse(Image image)
        {
            return new ImageResponse
            {
                Id = image.Id,
                FileName = image.FileName,
                FilePath = image.FilePath,
                FileSize = image.FileSize,
                MimeType = image.MimeType,
                FileUrl = $"/api/images/{image.Id}/content",
                TakenAt = image.TakenAt,
                TripId = image.TripId,
                TripName = image.Trip?.Name,
                IsAiGenerated = image.IsAiGenerated,
                AiPrompt = image.AiPrompt,
                AiStyle = image.AiStyle,
                UserId = image.UserId,
                CreatedAt = image.CreatedAt,
                Tags = image.ImageTags?.Select(it => new TagResponse
                {
                    Id = it.TagId,
                    Name = it.Tag?.Name
                }).ToList()
            };
        }

        #endregion
    }
}