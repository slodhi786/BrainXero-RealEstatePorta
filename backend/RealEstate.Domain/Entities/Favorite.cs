namespace RealEstate.Domain.Entities
{
    public class Favorite
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public Guid PropertyId { get; set; }
        public Property Property { get; set; } = default!;
    }
}
