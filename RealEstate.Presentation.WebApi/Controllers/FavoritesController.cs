using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Application.Interfaces;
using RealEstate.Presentation.Contracts.Common;
using System.Security.Claims;

namespace RealEstate.Presentation.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        // Helper to get current user id from token (sub or nameid)
        private Guid GetCurrentUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(sub)) throw new InvalidOperationException("User id claim not found.");

            return Guid.Parse(sub);
        }

        [Authorize]
        [HttpPost("add/{propertyId:guid}")]
        public async Task<IActionResult> AddToFavorites(Guid propertyId)
        {
            var userId = GetCurrentUserId();
            var added = await _favoriteService.AddToFavoritesAsync(userId, propertyId);

            return added
                ? Ok(ApiResponse<object>.Ok(added, "Added to favorites."))
                : BadRequest(ApiResponse<object>.Fail(400, "Could not add favorite."));
        }

        [Authorize]
        [HttpDelete("remove/{propertyId:guid}")]
        public async Task<IActionResult> RemoveFromFavorites(Guid propertyId)
        {
            var userId = GetCurrentUserId();
            var removed = await _favoriteService.RemoveFromFavoritesAsync(userId, propertyId);

            return removed 
                ? Ok(ApiResponse<bool>.Ok(removed, "Property removed from favorites."))
                : Ok(ApiResponse<bool>.Ok(removed, "Could not remove property from favorites."));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = GetCurrentUserId();
            var favorites = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(ApiResponse<IEnumerable<PropertyDto>>.Ok(favorites, "Favorites loaded."));
        }
    }
}
