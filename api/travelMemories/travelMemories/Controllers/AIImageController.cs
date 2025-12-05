using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using TravelMemories.Core.DTOs;
using TravelMemories.Core.DTOs.AIImage;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;

namespace TravelMemories.Controllers
{
    [ApiController]
    [Route("api/ai-images")]
    [Authorize]
    public class AIImageController : BaseController
    {
        private readonly IAIImageService _aiImageService;
        private readonly IUserService _userService;
        private readonly ILogger<AIImageController> _logger;

        public AIImageController(IAIImageService aiImageService, IUserService userService, ILogger<AIImageController> logger)
        {
            _aiImageService = aiImageService;
            _userService = userService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<AIImageResponse>> GenerateImage([FromBody] AIImageRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => $"{x.Key}: {e.ErrorMessage}"))
                    .ToList();
                return BadRequest(ErrorDto.ValidationError("Invalid request data", errors));
            }

            if (request == null)
            {
                return BadRequest(ErrorDto.ValidationError("Request body cannot be null"));
            }

            var userId = GetUserId();

            try
            {
                // Check if user has quota available
                var hasQuota = await _aiImageService.CheckUserQuotaAsync(userId);

                if (!hasQuota)
                {
                    return BadRequest(ErrorDto.FromException("AI image generation quota exceeded"));
                }

                var image = await _aiImageService.GenerateImageAsync(userId, request);

                return Ok(new AIImageResponse
                {
                    ImageId = image.Id,
                    Url = $"/api/images/{image.Id}/content",
                    Prompt = image.AiPrompt,
                    Style = image.AiStyle,
                    CreatedAt = image.CreatedAt,
                    TripId = image.TripId
                });
            }
            catch (ArgumentException ex)
            {
                // This could be a configuration issue (missing API key/URL)
                _logger.LogError(ex, "Configuration or validation error in AI image generation");
                return BadRequest(ErrorDto.ValidationError(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ErrorDto.FromException(ex.Message));
            }
            catch (HttpRequestException ex)
            {
                // This could be a HuggingFace API credential/connection issue
                _logger.LogError(ex, "HTTP error calling HuggingFace API");
                return BadRequest(ErrorDto.FromException($"Failed to generate image. Please check API configuration. {ex.Message}"));
            }
            catch (Exception ex)
            {
                // Log unexpected errors but don't expose internal details
                _logger.LogError(ex, "Unexpected error in AI image generation");
                return StatusCode(500, ErrorDto.FromException("An unexpected error occurred while generating the image"));
            }
        }

        [HttpGet("quota")]
        public async Task<ActionResult<AIQuotaResponse>> GetQuota()
        {
            var userId = GetUserId();

            try
            {
                var user = await _userService.GetUserByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(ErrorDto.NotFound("User not found"));
                }

                var usedCount = await _aiImageService.GetUserAiGenerationCountAsync(userId);
                var remaining = Math.Max(0, user.AiQuota - usedCount);

                // Calculate reset date (first day of next month)
                var now = DateTime.UtcNow;
                var resetDate = new DateTime(now.Year, now.Month, 1).AddMonths(1);

                return Ok(new AIQuotaResponse
                {
                    Total = user.AiQuota,
                    Used = usedCount,
                    Remaining = remaining,
                    ResetDate = resetDate
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ErrorDto.FromException(ex.Message));
            }
        }

        [HttpGet("user-images")] // Dedicated endpoint
        public async Task<ActionResult<IEnumerable<Image>>> GetUserAiImages()
        {
            var userId = GetUserId(); // Get the authenticated user ID from the token

            if (userId == Guid.Empty)
            {
                return Unauthorized(ErrorDto.Unauthorized("User not authenticated or ID missing."));
            }

            try
            {
                var images = await _aiImageService.GetAiImagesForUserAsync(userId);
                // You may want to map the Image object to a smaller DTO model
                // to avoid exposing internal model details.
                // For example, create a new DTO: AIImageResponseForList
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorDto.FromException($"Failed to retrieve AI images: {ex.Message}"));
            }
        }

    }
}