﻿namespace RealEstate.Application.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}
