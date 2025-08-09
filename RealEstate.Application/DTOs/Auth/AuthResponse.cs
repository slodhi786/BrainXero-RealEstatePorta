namespace RealEstate.Application.DTOs.Auth
{
    public class AuthResponse
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
        public DateTime Expiration { get; set; }
    }
}
