namespace RealEstate.Application.DTOs.Properties
{
    public class CreatePropertyRequest
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public string Location { get; set; } = default!;
        public List<string> ImageUrls { get; set; } = new();
    }
}
