using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RealEstate.Application.DTOs.Auth;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Presentation.Contracts.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RealEstate.Infrastructure.Identity.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return new ApiResponse<AuthResponse>
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description)),
                    StatusCode = StatusCodes.Status406NotAcceptable
                };
            }

            var token = await GenerateJwtToken(user);
            return new ApiResponse<AuthResponse>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "User registered successfully."
            };
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return new ApiResponse<AuthResponse>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status406NotAcceptable,
                    Message = "Invalid email or password."
                };

            var token = await GenerateJwtToken(user);

            return new ApiResponse<AuthResponse>
            {
                Success = true,
                Data = token,
                StatusCode = StatusCodes.Status200OK,
                Message = "Signed in successfully."
            };
        }


        private Task<AuthResponse> GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiresInMinutes"])),
                signingCredentials: creds
            );

            return Task.FromResult(new AuthResponse
            {
                UserId = user.Id,
                UserName = user.UserName ?? user.Email!,
                Email = user.Email!,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            });
        }
    }
}
