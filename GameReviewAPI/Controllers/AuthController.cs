using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using GameReviewAPI.Data;      // ✅ REQUIRED for AppDbContext
using GameReviewAPI.Models;    // ✅ REQUIRED for User, RegisterRequest, etc.
namespace GameReviewAPI.Controllers // ✅ REQUIRED
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet("reviews/{gameId}")]
        public async Task<IActionResult> GetReviews(int gameId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.GameId == gameId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (await _context.Users.AnyAsync(u =>
                    u.Username == registerRequest.Username ||
                    u.Email == registerRequest.Email))
                {
                    return BadRequest(new
                    {
                        message = "Username or email already exists",
                        field = await _context.Users.AnyAsync(u => u.Username == registerRequest.Username)
                            ? "username"
                            : "email"
                    });
                }

                var user = new User
                {
                    Username = registerRequest.Username.Trim(),
                    Email = registerRequest.Email.Trim().ToLower(),
                    FullName = registerRequest.FullName.Trim(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password)
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Registration successful",
                    username = user.Username
                });
            }
            catch (Exception ex)
            {
                // Log full error to console
                Console.WriteLine("REGISTRATION ERROR: " + ex.Message);
                Console.WriteLine("STACK TRACE: " + ex.StackTrace);

                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var normalizedInput = loginRequest.Username.ToLower().Trim();

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Username.ToLower() == normalizedInput ||
                    u.Email.ToLower() == normalizedInput);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid credentials",
                    field = "username"
                });
            }

            if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                return Unauthorized(new
                {
                    message = "Invalid credentials",
                    field = "password"
                });
            }

            var token = GenerateJwtToken(user.Username);
            return Ok(new
            {
                message = "Login successful",
                token,
                username = user.Username
            });
        }

        [HttpPost("submit-review")]
        public async Task<IActionResult> SubmitReview([FromBody] ReviewRequest reviewRequest)
        {
            var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == reviewRequest.GameId);
            if (game == null)
            {
                return NotFound(new { message = "Game not found" });
            }

            var newReview = new Review
            {
                Username = reviewRequest.Username,
                GameId = reviewRequest.GameId,
                ReviewText = reviewRequest.ReviewText,
                Rating = reviewRequest.Rating,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(newReview);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review submitted successfully" });
        }

        private string GenerateJwtToken(string username)
        {
            var keyString = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new InvalidOperationException("JWT Key is missing in configuration.");
            }

            var key = new SymmetricSecurityKey(Convert.FromBase64String(keyString));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, username)
        };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }       

    }
}
