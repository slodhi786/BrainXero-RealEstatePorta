﻿namespace RealEstate.Presentation.Contracts.Common
{
    public sealed class PagedResult<T>
    {
        public int TotalCount { get; init; }
        public int Page { get; init; }
        public int PageSize { get; init; }
        public IEnumerable<T> Items { get; init; } = Enumerable.Empty<T>();
    }
}
