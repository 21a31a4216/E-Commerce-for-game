using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameReviewAPI.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string ReviewText { get; set; } = string.Empty;

        [Range(1, 10)]
        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int GameId { get; set; }

        [ForeignKey("GameId")]
        public Game? Game { get; set; }
    }
}
