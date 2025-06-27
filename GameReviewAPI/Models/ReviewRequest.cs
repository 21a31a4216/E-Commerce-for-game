namespace GameReviewAPI.Models
{
    public class ReviewRequest
    {
        public string Username { get; set; } = string.Empty;
        public string ReviewText { get; set; } = string.Empty;
        public int GameId { get; set; }
        public int Rating { get; set; }
    }
}
