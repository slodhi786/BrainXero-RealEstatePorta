using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Persistence.Data;

namespace RealEstate.Infrastructure.Persistence.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public FavoriteService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<bool> AddToFavoritesAsync(Guid userId, Guid propertyId)
        {
            // ensure property exists
            var property = await _db.Properties.FindAsync(propertyId);
            if (property == null) return false;

            // do not duplicate
            var exists = await _db.Favorites.AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);
            if (exists) return true; // idempotent

            var favorite = new Favorite
            {
                UserId = userId,
                PropertyId = propertyId
            };

            _db.Favorites.Add(favorite);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFromFavoritesAsync(Guid userId, Guid propertyId)
        {
            var favorite = await _db.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

            if (favorite == null) return false;

            _db.Favorites.Remove(favorite);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<PropertyDto>> GetFavoritesAsync(Guid userId)
        {
            var properties = await _db.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.Property)
                .ToListAsync();

            return _mapper.Map<List<PropertyDto>>(properties);
        }
    }
}
