using FluentAssertions;
using Moq;
using TravelMemories.Core.DTOs.Auth;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;
using TravelMemories.Service.Services;
using Xunit;

namespace TravelMemories.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _jwtServiceMock = new Mock<IJwtService>();
            _authService = new AuthService(_userRepositoryMock.Object, _jwtServiceMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowException_WhenEmailExists()
        {
            var registerDto = new RegisterDto
            {
                Email = "existing@example.com",
                Password = "Test123!@#",
                FirstName = "Test",
                LastName = "User"
            };

            _userRepositoryMock
                .Setup(r => r.EmailExistsAsync(registerDto.Email))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.RegisterAsync(registerDto));
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenValidRequest()
        {
            var registerDto = new RegisterDto
            {
                Email = "new@example.com",
                Password = "Test123!@#",
                FirstName = "Test",
                LastName = "User"
            };

            _userRepositoryMock
                .Setup(r => r.EmailExistsAsync(registerDto.Email))
                .ReturnsAsync(false);

            User? savedUser = null;
            _userRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<User>()))
                .Callback<User>(u => savedUser = u)
                .Returns(Task.CompletedTask);

            _userRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            _jwtServiceMock
                .Setup(j => j.GenerateJwtToken(It.IsAny<User>()))
                .Returns("test-token");

            var result = await _authService.RegisterAsync(registerDto);

            result.Should().NotBeNull();
            result.Token.Should().Be("test-token");
            result.Email.Should().Be(registerDto.Email);
            result.FirstName.Should().Be(registerDto.FirstName);
            result.LastName.Should().Be(registerDto.LastName);
            
            savedUser.Should().NotBeNull();
            savedUser!.Email.Should().Be(registerDto.Email);
            savedUser.Role.Should().Be(UserRoles.User);
            savedUser.StorageQuota.Should().Be(10240);
            savedUser.AiQuota.Should().Be(50);
            
            _userRepositoryMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
            _userRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowException_WhenUserNotFound()
        {
            var loginDto = new LoginDto
            {
                Email = "nonexistent@example.com",
                Password = "Test123!@#"
            };

            _userRepositoryMock
                .Setup(r => r.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowException_WhenPasswordInvalid()
        {
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "WrongPassword"
            };

            var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = loginDto.Email,
                PasswordHash = passwordHasher.HashPassword(null, "CorrectPassword"),
                FirstName = "Test",
                LastName = "User"
            };

            _userRepositoryMock
                .Setup(r => r.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenValidCredentials()
        {
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "Test123!@#"
            };

            var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = loginDto.Email,
                PasswordHash = passwordHasher.HashPassword(null, loginDto.Password),
                FirstName = "Test",
                LastName = "User",
                Role = UserRoles.User
            };

            _userRepositoryMock
                .Setup(r => r.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            _jwtServiceMock
                .Setup(j => j.GenerateJwtToken(user))
                .Returns("test-token");

            var result = await _authService.LoginAsync(loginDto);

            result.Should().NotBeNull();
            result.Token.Should().Be("test-token");
            result.Email.Should().Be(loginDto.Email);
            result.UserId.Should().Be(user.Id);
        }
    }
}

