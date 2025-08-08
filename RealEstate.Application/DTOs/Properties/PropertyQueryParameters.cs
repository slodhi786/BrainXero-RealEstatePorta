﻿namespace RealEstate.Application.DTOs.Properties
{
    public class PropertyQueryParameters
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 10;

        public int Page { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string SortBy { get; set; } = "Price"; // default sorting
        public string SortOrder { get; set; } = "asc"; // asc or desc
    }
}
