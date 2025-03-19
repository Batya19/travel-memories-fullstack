using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using travelMemories.Core.Constants;
using travelMemories.Core.DTOs.Auth;
using travelMemories.Core.Interfaces;
using travelMemories.Core.Interfaces.Repositories;
using travelMemories.Core.Models;   
using travelMemories.Service.Helpers;

namespace travelMemories.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid email or password");
            }

            string token = _jwtHelper.GenerateToken(user);
            DateTime expiresAt = DateTime.UtcNow.AddHours(12);

            return new AuthResponse
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = expiresAt,
                UserDetails = new UserDetails
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    StorageQuota = user.StorageQuota,
                    StorageUsed = 0, // Will be implemented later
                    AiQuota = user.AiQuota,
                    AiUsed = 0 // Will be implemented later
                }
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            bool emailExists = await _userRepository.EmailExistsAsync(request.Email);
            if (emailExists)
            {
                throw new Exception("Email already exists");
            }

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Role = Roles.User,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

            await _userRepository.CreateAsync(user);

            string token = _jwtHelper.GenerateToken(user);
            DateTime expiresAt = DateTime.UtcNow.AddHours(12);

            return new AuthResponse
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = expiresAt,
                UserDetails = new UserDetails
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    StorageQuota = user.StorageQuota,
                    StorageUsed = 0,
                    AiQuota = user.AiQuota,
                    AiUsed = 0
                }
            };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            return _jwtHelper.ValidateToken(token);
        }
    }
}