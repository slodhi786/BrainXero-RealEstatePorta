using RealEstate.Domain.Enums;

namespace RealEstate.Application.DTOs.Properties
{
    public class UpdatePropertyRequest
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }

        public string Address { get; set; } = "";
        public string Location { get; set; } = default!;
        public string City { get; set; } = default!;

        public ListingType ListingType { get; set; } = ListingType.Sale;
        public string PropertyType { get; set; }

        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? CarSpots { get; set; }
        public string SizeLabel { get; set; }
        public string AreaLabel { get; set; }

        public string Status { get; set; }
        public string ThumbnailUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public double? Lat { get; set; }
        public double? Lng { get; set; }
    }
}
