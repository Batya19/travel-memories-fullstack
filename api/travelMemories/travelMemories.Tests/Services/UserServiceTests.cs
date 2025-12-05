using FluentAssertions;
using Moq;
using TravelMemories.Core.DTOs.User;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Models;
using TravelMemories.Service.Services;
using Xunit;

namespace TravelMemories.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _userService = new UserService(_userRepositoryMock.Object);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnUser_WhenExists()
        {
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(user);

            var result = await _userService.GetUserByIdAsync(userId);

            result.Should().NotBeNull();
            result.Id.Should().Be(userId);
            result.Email.Should().Be(user.Email);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            var userId = Guid.NewGuid();

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var result = await _userService.GetUserByIdAsync(userId);

            result.Should().BeNull();
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldThrowException_WhenUserNotFound()
        {
            var userId = Guid.NewGuid();
            var updateDto = new UpdateUserDto
            {
                FirstName = "Updated"
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _userService.UpdateUserAsync(userId, updateDto));
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldThrowException_WhenEmailExists()
        {
            var userId = Guid.NewGuid();
            var existingUser = new User
            {
                Id = userId,
                Email = "old@example.com",
                FirstName = "Old"
            };

            var updateDto = new UpdateUserDto
            {
                Email = "new@example.com"
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _userRepositoryMock
                .Setup(r => r.EmailExistsAsync("new@example.com"))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _userService.UpdateUserAsync(userId, updateDto));
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldUpdateUser_WhenValidRequest()
        {
            var userId = Guid.NewGuid();
            var existingUser = new User
            {
                Id = userId,
                Email = "old@example.com",
                FirstName = "Old",
                LastName = "Name"
            };

            var updateDto = new UpdateUserDto
            {
                FirstName = "New",
                LastName = "Name"
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _userRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            var result = await _userService.UpdateUserAsync(userId, updateDto);

            result.Should().NotBeNull();
            result.FirstName.Should().Be("New");
            result.LastName.Should().Be("Name");
            result.Email.Should().Be("old@example.com");
            
            _userRepositoryMock.Verify(r => r.Update(It.IsAny<User>()), Times.Once);
            _userRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CheckStorageQuotaAsync_ShouldReturnTrue_WhenQuotaAvailable()
        {
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                StorageQuota = 10240
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(user);

            _userRepositoryMock
                .Setup(r => r.GetTotalStorageUsedAsync(userId))
                .ReturnsAsync(5000L * 1024 * 1024);

            var result = await _userService.CheckStorageQuotaAsync(userId, 1000 * 1024 * 1024);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task CheckStorageQuotaAsync_ShouldReturnFalse_WhenQuotaExceeded()
        {
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                StorageQuota = 10240
            };

            _userRepositoryMock
                .Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(user);

            _userRepositoryMock
                .Setup(r => r.GetTotalStorageUsedAsync(userId))
                .ReturnsAsync(10000L * 1024 * 1024);

            var newFileSizeBytes = 500 * 1024 * 1024;
            var result = await _userService.CheckStorageQuotaAsync(userId, newFileSizeBytes);

            result.Should().BeFalse();
        }
    }
}

