namespace RealEstate.Application.DTOs.Properties
{
    public class SearchPropertyRequest
    {
        public string Title { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
    }
}
