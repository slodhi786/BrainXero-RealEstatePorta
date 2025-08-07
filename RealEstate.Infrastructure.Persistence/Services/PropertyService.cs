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

        public async Task<PropertyDto> GetByIdAsync(Guid id)
        {
            var property = await _db.Properties.FirstOrDefaultAsync(p => p.Id == id);
            return property == null ? null : _mapper.Map<PropertyDto>(property);
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
