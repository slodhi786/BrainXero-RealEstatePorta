using RealEstate.Domain.Enums;

namespace RealEstate.Domain.Entities
{
    public class Property
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public string Address { get; set; } = default!;
        public decimal Price { get; set; }
        public ListingType ListingType { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public int CarSpots { get; set; }
        public string Description { get; set; } = default!;
        public List<string> ImageUrls { get; set; } = new();

        public ICollection<Favorite> FavoritedBy { get; set; } = new List<Favorite>();
    }
}
