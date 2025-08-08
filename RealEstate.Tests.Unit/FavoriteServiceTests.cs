using Microsoft.EntityFrameworkCore;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Persistence.Data;
using RealEstate.Infrastructure.Persistence.Services;

namespace RealEstate.Tests.Unit
{
    public class FavoriteServiceTests
    {
        private static ApplicationDbContext CreateDb()
        {
            var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase($"fav_db_{Guid.NewGuid()}")
                .Options;
            return new ApplicationDbContext(opts);
        }

        [Fact]
        public async Task Add_Then_Get_Favorites_Works()
        {
            using var db = CreateDb();
            var mapper = TestMapping.CreateMapper();

            var userId = Guid.NewGuid();
            var property = new Property { Id = Guid.NewGuid(), Title = "X", Address = "A", Price = 10, Description = "D", ImageUrls = new() };
            db.Users.Add(new User
            {
                Id = userId,
                Email = "u@realestateportal.com",
                UserName = "u@realestateportal.com",
                NormalizedEmail = "U@REALESTATEPORTAL.COM",
                NormalizedUserName = "U@REALESTATEPORTAL.COM",
              
                PasswordHash = "TEST_HASH", // dummy non-null
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            });
            db.Properties.Add(property);
            await db.SaveChangesAsync();

            var svc = new FavoriteService(db, mapper);

            var ok = await svc.AddToFavoritesAsync(userId, property.Id);
            Assert.True(ok);

            var list = await svc.GetFavoritesAsync(userId);
            Assert.Single(list);
            Assert.Equal(property.Id, list[0].Id);
        }
    }
}
