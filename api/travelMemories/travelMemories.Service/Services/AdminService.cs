using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using TravelMemories.Core.DTOs.Admin;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Models;
using TravelMemories.Data.Context;

namespace TravelMemories.Service.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserRepository _userRepository;
        private readonly ITripRepository _tripRepository;
        private readonly IImageRepository _imageRepository;

        public AdminService(
            ApplicationDbContext context,
            IUserRepository userRepository,
            ITripRepository tripRepository,
            IImageRepository imageRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _tripRepository = tripRepository;
            _imageRepository = imageRepository;
        }

        public async Task<StatisticsResponse> GetStatisticsAsync()
        {
            var now = DateTime.UtcNow;
            var sixMonthsAgo = now.AddMonths(-6);

            var totalUsers = await _context.Users.CountAsync();
            var totalTrips = await _context.Trips.CountAsync();
            var totalImages = await _context.Images.CountAsync();
            var totalAiImages = await _context.Images.CountAsync(i => i.IsAiGenerated);

            var totalStorageUsedBytes = await _context.Images.SumAsync(i => i.FileSize);
            var totalStorageUsedMB = (int)Math.Ceiling(totalStorageUsedBytes / (1024.0 * 1024.0));

            var recentActivity = await GetRecentUserActivityAsync(5);

            var usersByMonth = await _context.Users
                .Where(u => u.CreatedAt >= sixMonthsAgo)
                .GroupBy(u => new { Month = u.CreatedAt.Month, Year = u.CreatedAt.Year })
                .Select(g => new
                {
                    MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                    Count = g.Count()
                })
                .ToDictionaryAsync(k => k.MonthYear, v => v.Count);

            var tripsByMonth = await _context.Trips
                .Where(t => t.CreatedAt >= sixMonthsAgo)
                .GroupBy(t => new { Month = t.CreatedAt.Month, Year = t.CreatedAt.Year })
                .Select(g => new
                {
                    MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                    Count = g.Count()
                })
                .ToDictionaryAsync(k => k.MonthYear, v => v.Count);

            var imagesByMonth = await _context.Images
                .Where(i => i.CreatedAt >= sixMonthsAgo)
                .GroupBy(i => new { Month = i.CreatedAt.Month, Year = i.CreatedAt.Year })
                .Select(g => new
                {
                    MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                    Count = g.Count()
                })
                .ToDictionaryAsync(k => k.MonthYear, v => v.Count);

            return new StatisticsResponse
            {
                TotalUsers = totalUsers,
                TotalTrips = totalTrips,
                TotalImages = totalImages,
                TotalAiImages = totalAiImages,
                TotalStorageUsedMB = totalStorageUsedMB,
                RecentUserActivity = recentActivity,
                UsersByMonth = usersByMonth,
                TripsByMonth = tripsByMonth,
                ImagesByMonth = imagesByMonth
            };
        }

        public async Task<IEnumerable<UserManagementResponse>> GetUsersAsync(int? limit = null, int? offset = null, string searchTerm = null)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(u =>
                    u.Email.ToLower().Contains(searchTerm) ||
                    u.FirstName.ToLower().Contains(searchTerm) ||
                    u.LastName.ToLower().Contains(searchTerm));
            }

            if (offset.HasValue && offset.Value > 0)
            {
                query = query.Skip(offset.Value);
            }

            if (limit.HasValue && limit.Value > 0)
            {
                query = query.Take(limit.Value);
            }

            var users = await query.ToListAsync();
            var result = new List<UserManagementResponse>();

            foreach (var user in users)
            {
                var storageUsedBytes = await _userRepository.GetTotalStorageUsedAsync(user.Id);
                var storageUsed = (int)Math.Ceiling(storageUsedBytes / (1024.0 * 1024.0));

                var tripCount = await _context.Trips
                    .CountAsync(t => t.UserId == user.Id);

                var imageCount = await _context.Images
                    .CountAsync(i => i.UserId == user.Id);

                result.Add(new UserManagementResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    StorageQuota = user.StorageQuota,
                    AiQuota = user.AiQuota,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    StorageUsed = storageUsed,
                    TripCount = tripCount,
                    ImageCount = imageCount
                });
            }

            return result;
        }

        public async Task<UserManagementResponse> GetUserByIdAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            var storageUsedBytes = await _userRepository.GetTotalStorageUsedAsync(user.Id);
            var storageUsed = (int)Math.Ceiling(storageUsedBytes / (1024.0 * 1024.0));

            var tripCount = await _context.Trips
                .CountAsync(t => t.UserId == user.Id);

            var imageCount = await _context.Images
                .CountAsync(i => i.UserId == user.Id);

            return new UserManagementResponse
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                StorageQuota = user.StorageQuota,
                AiQuota = user.AiQuota,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                StorageUsed = storageUsed,
                TripCount = tripCount,
                ImageCount = imageCount
            };
        }

        public async Task<UserManagementResponse> CreateUserAsync(UserManagementRequest request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FirstName = request.FirstName ?? "",
                LastName = request.LastName ?? "",
                Role = request.Role ?? UserRoles.User,
                StorageQuota = request.StorageQuota ?? 10240, // 10GB by default
                AiQuota = request.AiQuota ?? 50,
                CreatedAt = DateTime.UtcNow
            };

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.PasswordHash = Convert.ToBase64String(
                    SHA256.Create().ComputeHash(
                        Encoding.UTF8.GetBytes(request.Password)
                    )
                );
            }
            else
            {
                throw new InvalidOperationException("Password is required");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserManagementResponse
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                StorageQuota = user.StorageQuota,
                AiQuota = user.AiQuota,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                StorageUsed = 0,
                TripCount = 0,
                ImageCount = 0
            };
        }

        public async Task<UserManagementResponse> UpdateUserAsync(Guid userId, UserManagementRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != userId)
                {
                    throw new InvalidOperationException("Email is already in use by another user");
                }
                user.Email = request.Email;
            }

            if (!string.IsNullOrEmpty(request.FirstName))
            {
                user.FirstName = request.FirstName;
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                user.LastName = request.LastName;
            }

            if (!string.IsNullOrEmpty(request.Role))
            {
                if (request.Role != UserRoles.User && request.Role != UserRoles.SystemAdmin)
                {
                    throw new InvalidOperationException($"Invalid role. Allowed values: {UserRoles.User}, {UserRoles.SystemAdmin}");
                }
                user.Role = request.Role;
            }

            if (request.StorageQuota.HasValue && request.StorageQuota.Value > 0)
            {
                user.StorageQuota = request.StorageQuota.Value;
            }

            if (request.AiQuota.HasValue && request.AiQuota.Value > 0)
            {
                user.AiQuota = request.AiQuota.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.PasswordHash = Convert.ToBase64String(
                    SHA256.Create().ComputeHash(
                        Encoding.UTF8.GetBytes(request.Password)
                    )
                );
            }

            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            var storageUsedBytes = await _userRepository.GetTotalStorageUsedAsync(user.Id);
            var storageUsed = (int)Math.Ceiling(storageUsedBytes / (1024.0 * 1024.0));

            var tripCount = await _context.Trips
                .CountAsync(t => t.UserId == user.Id);

            var imageCount = await _context.Images
                .CountAsync(i => i.UserId == user.Id);

            return new UserManagementResponse
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                StorageQuota = user.StorageQuota,
                AiQuota = user.AiQuota,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                StorageUsed = storageUsed,
                TripCount = tripCount,
                ImageCount = imageCount
            };
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var trips = await _context.Trips.Where(t => t.UserId == userId).ToListAsync();
            var images = await _context.Images.Where(i => i.UserId == userId).ToListAsync();

            if (images.Any())
            {
                _context.Images.RemoveRange(images);
            }

            if (trips.Any())
            {
                _context.Trips.RemoveRange(trips);
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<SystemSettingsRequest> UpdateSystemSettingsAsync(SystemSettingsRequest request)
        {
            var settings = new SystemSettingsRequest
            {
                DefaultStorageQuota = request.DefaultStorageQuota,
                DefaultAiQuota = request.DefaultAiQuota,
                RegistrationEnabled = request.RegistrationEnabled
            };

            return await Task.FromResult(settings);
        }

        public async Task<SystemSettingsRequest> GetSystemSettingsAsync()
        {

            return await Task.FromResult(new SystemSettingsRequest
            {
                DefaultStorageQuota = 10240, // 10GB
                DefaultAiQuota = 50,
                RegistrationEnabled = true
            });
        }

        public async Task<IEnumerable<UserActivityItem>> GetRecentUserActivityAsync(int limit = 10)
        {
            var result = new List<UserActivityItem>();

            var recentTrips = await _context.Trips
                .OrderByDescending(t => t.CreatedAt)
                .Include(t => t.User)
                .Take(limit)
                .Select(t => new UserActivityItem
                {
                    UserId = t.UserId,
                    UserEmail = t.User.Email,
                    ActivityType = "Trip",
                    Description = $"Created trip: {t.Name}",
                    Timestamp = t.CreatedAt
                })
                .ToListAsync();

            result.AddRange(recentTrips);

            var recentImages = await _context.Images
                .OrderByDescending(i => i.CreatedAt)
                .Include(i => i.User)
                .Take(limit)
                .Select(i => new UserActivityItem
                {
                    UserId = i.UserId,
                    UserEmail = i.User.Email,
                    ActivityType = "Image",
                    Description = $"Uploaded image: {i.FileName}",
                    Timestamp = i.CreatedAt
                })
                .ToListAsync();

            result.AddRange(recentImages);

            return result
                .OrderByDescending(a => a.Timestamp)
                .Take(limit);
        }
    }
}