using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TravelMemories.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected Guid? GetUserId()
        {
            if (User?.FindFirst(ClaimTypes.NameIdentifier)?.Value is string userIdClaim)
            {
                if (Guid.TryParse(userIdClaim, out Guid parsedUserId))
                {
                    return parsedUserId;
                }
            }
            return null;
        }

        protected Guid GetRequiredUserId()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }
            return userId.Value;
        }
    }
}

