using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Persistence.Data;

namespace RealEstate.Infrastructure.Persistence.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public PropertyService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<List<PropertyDto>> GetAllAsync()
        {
            var properties = await _db.Properties.ToListAsync();
            return _mapper.Map<List<PropertyDto>>(properties);
        }

        public async Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAllAsync(PropertyQueryParameters p, string userId = null)
        {
            var q = _db.Properties.AsQueryable();

            if (!string.IsNullOrWhiteSpace(p.Q))
                q = q.Where(x => x.Title.Contains(p.Q) || x.Address!.Contains(p.Q) || x.City!.Contains(p.Q));

            if (!string.IsNullOrWhiteSpace(p.City))
                q = q.Where(x => x.City.Contains(p.City));

            if (!string.IsNullOrWhiteSpace(p.Type))
                q = q.Where(x => x.PropertyType == p.Type);

            if (p.MinPrice.HasValue) q = q.Where(x => x.Price >= p.MinPrice.Value);
            if (p.MaxPrice.HasValue) q = q.Where(x => x.Price <= p.MaxPrice.Value);
            if (p.Bedrooms.HasValue) q = q.Where(x => x.Bedrooms >= p.Bedrooms.Value);
            if (p.Bathrooms.HasValue) q = q.Where(x => x.Bathrooms >= p.Bathrooms.Value);

            // sort
            q = (p.SortBy?.ToLower(), p.SortOrder?.ToLower()) switch
            {
                ("title", "asc") => q.OrderBy(x => x.Title),
                ("title", _) => q.OrderByDescending(x => x.Title),
                ("bedrooms", "asc") => q.OrderBy(x => x.Bedrooms),
                ("bedrooms", _) => q.OrderByDescending(x => x.Bedrooms),
                ("price", "asc") => q.OrderBy(x => x.Price),
                _ => q.OrderByDescending(x => x.Price),
            };

            var total = await q.CountAsync();

            var page = await q
                .Skip((p.Page - 1) * p.PageSize)
                .Take(p.PageSize)
                .Select(x => new PropertyDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Address = x.Address,
                    Location = string.IsNullOrEmpty(x.Location) ? x.Address : x.Location + ", " + x.City,
                    City = x.City,
                    Price = x.Price,
                    Bedrooms = x.Bedrooms,
                    Bathrooms = x.Bathrooms,
                    CarSpots = x.CarSpots,
                    SizeLabel = x.SizeLabel,
                    AreaLabel = x.AreaLabel,
                    Status = x.Status,
                    ThumbnailUrl = x.ThumbnailUrl,
                    ImageUrls = x.ImageUrls,
                    Lat = x.Lat,
                    Lng = x.Lng,
                    PropertyType = x.PropertyType,
                })
                .ToListAsync();

            // favorites
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var uid))
            {
                var favIds = await _db.Favorites
                    .Where(f => f.UserId == uid)
                    .Select(f => f.PropertyId)
                    .ToListAsync();

                var favSet = favIds.ToHashSet();
                foreach (var dto in page) dto.IsFavorite = favSet.Contains(dto.Id);
            }

            return (page, total);
        }

        public async Task<PropertyDto> GetByIdAsync(Guid id, string userId = null)
        {
            var dto = await _db.Properties
                .Where(x => x.Id == id)
                .Select(x => new PropertyDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Address = x.Address,
                    Location = string.IsNullOrEmpty(x.Location) ? x.Address : x.Location + ", " + x.City,
                    City = x.City,
                    Price = x.Price,
                    Bedrooms = x.Bedrooms,
                    Bathrooms = x.Bathrooms,
                    CarSpots = x.CarSpots,
                    SizeLabel = x.SizeLabel,
                    AreaLabel = x.AreaLabel,
                    Status = x.Status,
                    ThumbnailUrl = x.ThumbnailUrl,
                    ImageUrls = x.ImageUrls,
                    Lat = x.Lat,
                    Lng = x.Lng,
                    PropertyType = x.PropertyType,
                })
                .FirstOrDefaultAsync();

            if (dto == null) return null;

            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var uid))
            {
                dto.IsFavorite = await _db.Favorites.AnyAsync(f => f.UserId == uid && f.PropertyId == id);
            }
            return dto;
        }

        public async Task<PropertyDto> CreateAsync(CreatePropertyRequest request)
        {
            var property = _mapper.Map<Property>(request);
            property.Id = Guid.NewGuid();

            _db.Properties.Add(property);
            await _db.SaveChangesAsync();

            return _mapper.Map<PropertyDto>(property);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdatePropertyRequest request)
        {
            var property = await _db.Properties.FindAsync(id);
            if (property == null) return false;

            _mapper.Map(request, property);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var property = await _db.Properties.FindAsync(id);
            if (property == null) return false;

            _db.Properties.Remove(property);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PropertyDto>> SearchAsync(SearchPropertyRequest request)
        {
            var query = _db.Properties.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Title))
                query = query.Where(p => p.Title.Contains(request.Title));

            if (!string.IsNullOrWhiteSpace(request.Address))
                query = query.Where(p => p.Address.Contains(request.Address));

            if (!string.IsNullOrWhiteSpace(request.City))
                query = query.Where(p => p.Address.Contains(request.City));

            if (request.MinPrice.HasValue)
                query = query.Where(p => p.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= request.MaxPrice.Value);

            if (request.Bedrooms.HasValue)
                query = query.Where(p => p.Bedrooms == request.Bedrooms.Value);

            if (request.Bathrooms.HasValue)
                query = query.Where(p => p.Bathrooms == request.Bathrooms.Value);

            var properties = await query.ToListAsync();
            return _mapper.Map<IEnumerable<PropertyDto>>(properties);
        }
    }
}
