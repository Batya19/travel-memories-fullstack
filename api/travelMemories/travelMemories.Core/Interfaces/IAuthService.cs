using System;
using System.Threading.Tasks;
using travelMemories.Core.DTOs.Auth;
using travelMemories.Core.Models;

namespace travelMemories.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> ValidateTokenAsync(string token);
    }
}