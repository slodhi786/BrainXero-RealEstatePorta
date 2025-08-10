namespace RealEstate.Application.DTOs.Properties
{
    public class PropertyQueryParameters
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 9;

        public int Page { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string SortBy { get; set; } = "Price"; // default sorting
        public string SortOrder { get; set; } = "asc"; // asc or desc
        public string Q { get; set; }
        public string City { get; set; }
        public string Type { get; set; } // House | Apartment | Plot
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
    }
}
