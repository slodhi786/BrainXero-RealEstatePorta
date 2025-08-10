using Microsoft.EntityFrameworkCore;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Enums;
using RealEstate.Infrastructure.Persistence.Data;
using RealEstate.Infrastructure.Persistence.Services;

namespace RealEstate.Tests.Unit
{
    public class PropertyServiceTests
    {
        private static ApplicationDbContext CreateDb()
        {
            var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase($"prop_db_{Guid.NewGuid()}")
                .Options;
            return new ApplicationDbContext(opts);
        }

        [Fact]
        public async Task GetAllAsync_Returns_Paged_Sorted_Data()
        {
            using var db = CreateDb();
            var mapper = TestMapping.CreateMapper();

            db.Properties.AddRange(
                new Property { Id = Guid.NewGuid(), Title = "B House", Address = "Khi", Price = 2_000_000M, ListingType = ListingType.Sale, Bedrooms = 3, Bathrooms = 2, CarSpots = 1, Description = "B", ImageUrls = new() },
                new Property { Id = Guid.NewGuid(), Title = "A House", Address = "Khi", Price = 1_000_000M, ListingType = ListingType.Sale, Bedrooms = 2, Bathrooms = 1, CarSpots = 1, Description = "A", ImageUrls = new() },
                new Property { Id = Guid.NewGuid(), Title = "C House", Address = "Lhr", Price = 3_000_000M, ListingType = ListingType.Sale, Bedrooms = 4, Bathrooms = 3, CarSpots = 2, Description = "C", ImageUrls = new() }
            );
            await db.SaveChangesAsync();

            var svc = new PropertyService(db, mapper);
            var qp = new PropertyQueryParameters { Page = 1, PageSize = 2, SortBy = "price", SortOrder = "asc" };

            var (items, total) = await svc.GetAllAsync(qp);

            Assert.Equal(3, total);
            var list = items.ToList();
            Assert.Equal(2, list.Count);
            Assert.Equal("A House", list[0].Title);
            Assert.Equal("B House", list[1].Title);
        }

        [Fact]
        public async Task CreateAsync_Persists_And_Maps()
        {
            using var db = CreateDb();
            var mapper = TestMapping.CreateMapper();
            var svc = new PropertyService(db, mapper);

            var dto = new CreatePropertyRequest
            {
                Title = "New Prop",
                Description = "Desc",
                Price = 123M,
                Location = "Khi",
                ImageUrls = new() { "img1" }
            };

            var created = await svc.CreateAsync(dto);
            Assert.NotEqual(Guid.Empty, created.Id);

            var inDb = await db.Properties.FindAsync(created.Id);
            Assert.NotNull(inDb);
            Assert.Equal("New Prop", inDb!.Title);
        }
    }
}
