using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Application.Interfaces;
using RealEstate.Presentation.Contracts.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RealEstate.Presentation.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // GET: api/property
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var properties = await _propertyService.GetAllAsync();
            var totalCount = properties.Count;

            var payload = new SearchResult<PropertyDto>
            {
                Items = properties,
                TotalCount = totalCount
            };

            return Ok(ApiResponse<SearchResult<PropertyDto>>.Ok(payload, "All properties."));
        }

        // GET: api/property/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            string? userId = null;
            if (User?.Identity?.IsAuthenticated == true)
                userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var dto = await _propertyService.GetByIdAsync(id, userId);
            if (dto == null) return NotFound(ApiResponse<object>.Fail(404, "Not found"));
            return Ok(ApiResponse<PropertyDto>.Ok(dto, "Property fetched."));
        }

        // POST: api/property
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
        {
            var created = await _propertyService.CreateAsync(request);

            return created is not null 
                ? Ok(ApiResponse<PropertyDto>.Ok(created, "Property created.")) 
                : Ok(ApiResponse<PropertyDto>.Ok(null, "Could not create the property."));

        }

        // PUT: api/property/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePropertyRequest request)
        {
            var updated = await _propertyService.UpdateAsync(id, request);
            return updated 
                ? Ok(ApiResponse<bool>.Ok(updated, "Property updated.")) 
                : Ok(ApiResponse<bool>.Ok(updated, "Could not update the property."));
        }

        // DELETE: api/property/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _propertyService.DeleteAsync(id);

            return deleted 
                ? Ok(ApiResponse<bool>.Ok(deleted, "Property deleted.")) 
                : Ok(ApiResponse<bool>.Ok(deleted, "Could not delete the property."));
        }

        // POST: api/property/search
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchPropertyRequest request)
        {
            var searchResult = await _propertyService.SearchAsync(request);
            var items = searchResult.ToList();
            var totalCount = items.Count;

            var payload = new SearchResult<PropertyDto>
            {
                Items = items,
                TotalCount = totalCount
            };

            return Ok(ApiResponse<SearchResult<PropertyDto>>.Ok(payload, "Search completed."));
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAll([FromQuery] PropertyQueryParameters queryParams)
        {
            string? userId = null;
            if (User?.Identity?.IsAuthenticated == true)
            {
                userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            var (items, totalCount) = await _propertyService.GetAllAsync(queryParams, userId);

            var payload = new PagedResult<PropertyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = queryParams.Page,
                PageSize = queryParams.PageSize
            };

            return Ok(ApiResponse<PagedResult<PropertyDto>>.Ok(payload, "Properties fetched."));
        }
    }
}
