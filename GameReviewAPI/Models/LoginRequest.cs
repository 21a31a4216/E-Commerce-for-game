namespace GameReviewAPI.Models
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public LoginRequest()
        {
            Username = string.Empty;
            Password = string.Empty;
        }
    }
}