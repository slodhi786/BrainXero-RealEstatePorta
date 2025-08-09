using RealEstate.Application.DTOs.Properties;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<List<PropertyDto>> GetAllAsync();
        Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAllAsync(PropertyQueryParameters queryParams, string userId = null);
        Task<PropertyDto> GetByIdAsync(Guid id);
        Task<PropertyDto> CreateAsync(CreatePropertyRequest request);
        Task<bool> UpdateAsync(Guid id, UpdatePropertyRequest request);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<PropertyDto>> SearchAsync(SearchPropertyRequest request);
    }
}
