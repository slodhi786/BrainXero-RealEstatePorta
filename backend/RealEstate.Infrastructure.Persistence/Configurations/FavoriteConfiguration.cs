using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Persistence.Configurations
{
    public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
    {
        public void Configure(EntityTypeBuilder<Favorite> builder)
        {
            // Composite PK
            builder.HasKey(f => new { f.UserId, f.PropertyId });

            // Relationships
            builder.HasOne(f => f.User)
                   .WithMany(u => u.Favorites)
                   .HasForeignKey(f => f.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(f => f.Property)
                   .WithMany(p => p.FavoritedBy)
                   .HasForeignKey(f => f.PropertyId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Index
            builder.HasIndex(f => f.UserId);
        }
    }
}
