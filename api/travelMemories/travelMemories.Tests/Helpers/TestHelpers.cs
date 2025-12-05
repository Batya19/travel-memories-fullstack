using TravelMemories.Core.Models;

namespace TravelMemories.Tests.Helpers
{
    public static class TestHelpers
    {
        public static User CreateTestUser(Guid? id = null, string email = "test@example.com")
        {
            return new User
            {
                Id = id ?? Guid.NewGuid(),
                Email = email,
                FirstName = "Test",
                LastName = "User",
                PasswordHash = "hashed_password",
                Role = UserRoles.User,
                StorageQuota = 10240,
                AiQuota = 50,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static Trip CreateTestTrip(Guid userId, Guid? id = null)
        {
            return new Trip
            {
                Id = id ?? Guid.NewGuid(),
                UserId = userId,
                Name = "Test Trip",
                Description = "Test Description",
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(7),
                LocationName = "Test Location",
                ShareId = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}

