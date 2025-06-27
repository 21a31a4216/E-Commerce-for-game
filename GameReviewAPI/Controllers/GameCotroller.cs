using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using GameReviewAPI.Data;
using GameReviewAPI.Models;

[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly AppDbContext _context;

    public GameController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGames()
    {
        var games = await _context.Games.ToListAsync();
        return Ok(games);
    }

    [HttpPost]
    public async Task<IActionResult> AddGame([FromBody] Game game)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Game added successfully", game });
    }
}
