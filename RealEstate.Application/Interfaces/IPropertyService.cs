using RealEstate.Application.DTOs.Properties;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<List<PropertyDto>> GetAllAsync();
        Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAllAsync(PropertyQueryParameters p, string userId = null);
        Task<PropertyDto> GetByIdAsync(Guid id, string userId = null);
        Task<PropertyDto> CreateAsync(CreatePropertyRequest request);
        Task<bool> UpdateAsync(Guid id, UpdatePropertyRequest request);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<PropertyDto>> SearchAsync(SearchPropertyRequest request);
    }
}
