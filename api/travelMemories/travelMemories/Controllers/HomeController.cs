using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TravelMemories.Controllers
{
    [ApiController]
    [Route("api")]
    public class HomeController : Controller
    {
        // In your .NET controller
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy" });
        }
    }
}
