using TravelMemories.Core.DTOs.Admin;

namespace TravelMemories.Core.Interfaces
{
    public interface IAdminService
    {
        Task<StatisticsResponse> GetStatisticsAsync();

        Task<IEnumerable<UserManagementResponse>> GetUsersAsync(int? limit = null, int? offset = null, string searchTerm = null);

        Task<UserManagementResponse> GetUserByIdAsync(Guid userId);

        Task<UserManagementResponse> CreateUserAsync(UserManagementRequest request);

        Task<UserManagementResponse> UpdateUserAsync(Guid userId, UserManagementRequest request);

        Task DeleteUserAsync(Guid userId);

        Task<SystemSettingsRequest> UpdateSystemSettingsAsync(SystemSettingsRequest request);

        Task<SystemSettingsRequest> GetSystemSettingsAsync();

        Task<IEnumerable<UserActivityItem>> GetRecentUserActivityAsync(int limit = 10);
    }
}