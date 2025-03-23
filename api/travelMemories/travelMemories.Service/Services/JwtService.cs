using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.Interfaces;
using TravelMemories.Core.Models;
using TravelMemories.Service.Helpers;

namespace TravelMemories.Service.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            return _configuration.GenerateJwtToken(user);
        }

        public bool ValidateToken(string token, out ClaimsPrincipal claimsPrincipal)
        {
            return _configuration.ValidateToken(token, out claimsPrincipal);
        }

        public Guid GetUserIdFromToken(string token)
        {
            if (ValidateToken(token, out var principal))
            {
                return principal.GetUserIdFromToken();
            }

            return Guid.Empty;
        }

        public IEnumerable<Claim> GetClaimsFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                return jwtToken?.Claims ?? Enumerable.Empty<Claim>();
            }
            catch
            {
                return Enumerable.Empty<Claim>();
            }
        }

        public bool IsTokenExpired(string token)
        {
            try
            {
                var expiration = token.GetTokenExpirationTime();
                return expiration < DateTime.UtcNow;
            }
            catch
            {
                return true;
            }
        }
    }
}