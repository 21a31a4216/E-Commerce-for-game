using Microsoft.AspNetCore.Mvc;

namespace GameReviewAPI.Controllers
{
    [ApiController]
    [Route("/")]  // Root URL
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is running!");
        }
    }
}
