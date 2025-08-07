namespace RealEstate.Application.DTOs.Properties
{
    public class PropertyDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public string Address { get; set; } = default!;
        public List<string> ImageUrls { get; set; } = new();
    }
}
