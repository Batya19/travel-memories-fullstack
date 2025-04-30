using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelMemories.Core.DTOs.Admin;
using TravelMemories.Core.DTOs;
using TravelMemories.Core.Interfaces;

namespace TravelMemories.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "SYSTEM_ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IAdminService adminService,
            ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<StatisticsResponse>> GetStatistics()
        {
            try
            {
                _logger.LogInformation("Retrieving system statistics");
                var stats = await _adminService.GetStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system statistics");
                return StatusCode(500, ErrorDto.FromException("Failed to retrieve system statistics", "ServerError"));
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserManagementResponse>>> GetUsers(
            [FromQuery] int? limit = null,
            [FromQuery] int? offset = null,
            [FromQuery] string searchTerm = null)
        {
            try
            {
                _logger.LogInformation("Retrieving users list");
                var users = await _adminService.GetUsersAsync(limit, offset, searchTerm);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users list");
                return StatusCode(500, ErrorDto.FromException("Failed to retrieve users list", "ServerError"));
            }
        }

        [HttpGet("users/{userId}")]
        public async Task<ActionResult<UserManagementResponse>> GetUserById(Guid userId)
        {
            try
            {
                _logger.LogInformation("Retrieving user with ID: {UserId}", userId);
                var user = await _adminService.GetUserByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(ErrorDto.NotFound("User not found"));
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user with ID: {UserId}", userId);
                return StatusCode(500, ErrorDto.FromException("Failed to retrieve user", "ServerError"));
            }
        }

        [HttpPost("users")]
        public async Task<ActionResult<UserManagementResponse>> CreateUser([FromBody] UserManagementRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ErrorDto.ValidationError("Invalid user data"));
                }

                _logger.LogInformation("Creating new user with email: {Email}", request.Email);
                var user = await _adminService.CreateUserAsync(request);

                return CreatedAtAction(nameof(GetUserById), new { userId = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while creating user");
                return BadRequest(ErrorDto.FromException(ex.Message, "ValidationError"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, ErrorDto.FromException("Failed to create user", "ServerError"));
            }
        }

        [HttpPut("users/{userId}")]
        public async Task<ActionResult<UserManagementResponse>> UpdateUser(Guid userId, [FromBody] UserManagementRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ErrorDto.ValidationError("Invalid user data"));
                }

                _logger.LogInformation("Updating user with ID: {UserId}", userId);
                var updatedUser = await _adminService.UpdateUserAsync(userId, request);

                if (updatedUser == null)
                {
                    return NotFound(ErrorDto.NotFound("User not found"));
                }

                return Ok(updatedUser);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while updating user");
                return BadRequest(ErrorDto.FromException(ex.Message, "ValidationError"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user with ID: {UserId}", userId);
                return StatusCode(500, ErrorDto.FromException("Failed to update user", "ServerError"));
            }
        }

        [HttpDelete("users/{userId}")]
        public async Task<ActionResult> DeleteUser(Guid userId)
        {
            try
            {
                _logger.LogInformation("Deleting user with ID: {UserId}", userId);
                await _adminService.DeleteUserAsync(userId);

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while deleting user");
                return BadRequest(ErrorDto.FromException(ex.Message, "ValidationError"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user with ID: {UserId}", userId);
                return StatusCode(500, ErrorDto.FromException("Failed to delete user", "ServerError"));
            }
        }

        [HttpGet("settings")]
        public async Task<ActionResult<SystemSettingsRequest>> GetSystemSettings()
        {
            try
            {
                _logger.LogInformation("Retrieving system settings");
                var settings = await _adminService.GetSystemSettingsAsync();
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system settings");
                return StatusCode(500, ErrorDto.FromException("Failed to retrieve system settings", "ServerError"));
            }
        }

        [HttpPut("settings")]
        public async Task<ActionResult<SystemSettingsRequest>> UpdateSystemSettings([FromBody] SystemSettingsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ErrorDto.ValidationError("Invalid settings data"));
                }

                _logger.LogInformation("Updating system settings");
                var updatedSettings = await _adminService.UpdateSystemSettingsAsync(request);

                return Ok(updatedSettings);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while updating system settings");
                return BadRequest(ErrorDto.FromException(ex.Message, "ValidationError"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating system settings");
                return StatusCode(500, ErrorDto.FromException("Failed to update system settings", "ServerError"));
            }
        }

        [HttpGet("user-activity")]
        public async Task<ActionResult<IEnumerable<UserActivityItem>>> GetRecentUserActivity([FromQuery] int limit = 10)
        {
            try
            {
                _logger.LogInformation("Retrieving recent user activity");
                var activity = await _adminService.GetRecentUserActivityAsync(limit);
                return Ok(activity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent user activity");
                return StatusCode(500, ErrorDto.FromException("Failed to retrieve user activity", "ServerError"));
            }
        }
    }
}