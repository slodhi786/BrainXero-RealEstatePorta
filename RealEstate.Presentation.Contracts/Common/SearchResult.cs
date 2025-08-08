namespace RealEstate.Presentation.Contracts.Common
{
    public sealed class SearchResult<T>
    {
        public int TotalCount { get; init; }
        public IEnumerable<T> Items { get; init; } = Enumerable.Empty<T>();
    }
}
