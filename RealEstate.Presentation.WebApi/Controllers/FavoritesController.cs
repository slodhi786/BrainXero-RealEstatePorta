using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.Interfaces;
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
            if (!added) return NotFound();
            return Ok(new { success = true });
        }

        [Authorize]
        [HttpDelete("remove/{propertyId:guid}")]
        public async Task<IActionResult> RemoveFromFavorites(Guid propertyId)
        {
            var userId = GetCurrentUserId();
            var removed = await _favoriteService.RemoveFromFavoritesAsync(userId, propertyId);
            if (!removed) return NotFound();
            return Ok(new { success = true });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = GetCurrentUserId();
            var favorites = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }
    }
}
