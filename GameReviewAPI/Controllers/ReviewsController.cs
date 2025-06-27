using Microsoft.AspNetCore.Mvc;
using GameReviewAPI.Models;
using GameReviewAPI.Data;

namespace GameReviewAPI.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

[HttpPost]
public IActionResult PostReview([FromBody] ReviewRequest reviewRequest)
{
    Console.WriteLine("📥 Incoming Review:");
    Console.WriteLine($"Username: {reviewRequest.Username}");
    Console.WriteLine($"Text: {reviewRequest.ReviewText}");
    Console.WriteLine($"Rating: {reviewRequest.Rating}");
    Console.WriteLine($"GameId: {reviewRequest.GameId}");

    if (string.IsNullOrWhiteSpace(reviewRequest.Username) || string.IsNullOrWhiteSpace(reviewRequest.ReviewText))
        return BadRequest("Username and ReviewText are required.");

    // 🔍 Optional: Check if Game exists
    var gameExists = _context.Games.Any(g => g.Id == reviewRequest.GameId);
    if (!gameExists)
        return NotFound($"Game with Id={reviewRequest.GameId} not found.");

    var newReview = new Review
    {
        Username = reviewRequest.Username,
        ReviewText = reviewRequest.ReviewText,
        Rating = reviewRequest.Rating,
        GameId = reviewRequest.GameId,
        CreatedAt = DateTime.UtcNow
    };

    _context.Reviews.Add(newReview);
    _context.SaveChanges();

    Console.WriteLine($"✅ Review saved from {newReview.Username}");

    return Ok(new { message = "Review saved successfully" });
}

    }
}
