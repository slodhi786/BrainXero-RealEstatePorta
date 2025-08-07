using Microsoft.AspNetCore.Identity;

namespace RealEstate.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}
