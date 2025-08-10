using RealEstate.Application.DTOs.Properties;

namespace RealEstate.Application.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> AddToFavoritesAsync(Guid userId, Guid propertyId);
        Task<bool> RemoveFromFavoritesAsync(Guid userId, Guid propertyId);
        Task<List<PropertyDto>> GetFavoritesAsync(Guid userId);
    }
}
