namespace RealEstate.Application.DTOs.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = default!;
        public DateTime Expiration { get; set; }
    }
}
