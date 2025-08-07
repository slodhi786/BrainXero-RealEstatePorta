using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Application.Interfaces;

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
            return Ok(properties);
        }

        // GET: api/property/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var property = await _propertyService.GetByIdAsync(id);
            if (property == null) return NotFound();
            return Ok(property);
        }

        // POST: api/property
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
        {
            var property = await _propertyService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = property.Id }, property);
        }

        // PUT: api/property/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePropertyRequest request)
        {
            var updated = await _propertyService.UpdateAsync(id, request);
            if (!updated) return NotFound();
            return NoContent();
        }

        // DELETE: api/property/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _propertyService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // POST: api/property/search
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchPropertyRequest request)
        {
            var properties = await _propertyService.SearchAsync(request);
            return Ok(properties);
        }
    }
}
