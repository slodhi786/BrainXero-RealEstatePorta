namespace RealEstate.Application.DTOs.Properties
{
    public class PropertyDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public string Address { get; set; }
        public string Location { get; set; }
        public string City { get; set; }
        public decimal Price { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? CarSpots { get; set; }
        public string SizeLabel { get; set; }
        public string AreaLabel { get; set; }
        public string Status { get; set; }
        public string ThumbnailUrl { get; set; }
        public List<string> ImageUrls { get; set; }
        public bool IsFavorite { get; set; }
        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public string PropertyType { get; set; }
    }
}