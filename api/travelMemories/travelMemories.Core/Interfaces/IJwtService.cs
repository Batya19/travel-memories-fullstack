using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwtToken(User user);
        bool ValidateToken(string token, out ClaimsPrincipal claimsPrincipal);
        Guid GetUserIdFromToken(string token);
        IEnumerable<Claim> GetClaimsFromToken(string token);
        bool IsTokenExpired(string token);
    }
}
