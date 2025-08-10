using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Persistence.Configurations
{
    public class PropertyConfiguration : IEntityTypeConfiguration<Property>
    {
        public void Configure(EntityTypeBuilder<Property> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
            builder.Property(p => p.Address).IsRequired();
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)");

            builder.Property(p => p.Description).HasMaxLength(1000);
            builder.Property(p => p.ImageUrls)
                   .HasConversion(
                       v => string.Join(';', v),
                       v => v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList()
                   )
                   .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                       (c1, c2) => c1.SequenceEqual(c2),
                       c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                       c => c.ToList()
                   ));

            builder.HasMany(p => p.FavoritedBy)
                   .WithOne(f => f.Property)
                   .HasForeignKey(f => f.PropertyId);
        }
    }
}
