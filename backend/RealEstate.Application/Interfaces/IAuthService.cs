using RealEstate.Application.DTOs.Auth;
using RealEstate.Presentation.Contracts.Common;

namespace RealEstate.Application.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
    }
}
