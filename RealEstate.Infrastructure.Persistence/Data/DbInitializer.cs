using RealEstate.Domain.Entities;
using RealEstate.Domain.Enums;

namespace RealEstate.Infrastructure.Persistence.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Properties.Any())
            {
                var properties = new List<Property>
                {
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Modern Family Home",
                        Address = "123 Main Street, Karachi",
                        Price = 25000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 4,
                        Bathrooms = 3,
                        CarSpots = 2,
                        Description = "Spacious family home with modern kitchen, garden, and parking space.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Luxury Apartment with Sea View",
                        Address = "456 Ocean View Road, Karachi",
                        Price = 18000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 3,
                        Bathrooms = 2,
                        CarSpots = 1,
                        Description = "High-rise apartment with stunning sea views and modern amenities.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                            "https://images.unsplash.com/photo-1613977257363-707ba9348227"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Cozy Rental Studio",
                        Address = "789 Central Avenue, Lahore",
                        Price = 55000,
                        ListingType = ListingType.Rent,
                        Bedrooms = 1,
                        Bathrooms = 1,
                        CarSpots = 0,
                        Description = "Compact yet stylish studio apartment near public transport.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1599423300746-b62533397364"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Spacious Suburban Villa",
                        Address = "101 Palm Drive, Islamabad",
                        Price = 35000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 5,
                        Bathrooms = 4,
                        CarSpots = 3,
                        Description = "Elegant villa with private pool, landscaped garden, and large living spaces.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1572120360610-d971b9b78825",
                            "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "City Center Office Space",
                        Address = "22 Business Plaza, Karachi",
                        Price = 120000,
                        ListingType = ListingType.Rent,
                        Bedrooms = 0,
                        Bathrooms = 2,
                        CarSpots = 0,
                        Description = "Premium office space in the heart of the city with all modern facilities.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1497366216548-37526070297c"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Beachfront Resort Villa",
                        Address = "Paradise Bay, Gwadar",
                        Price = 95000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 6,
                        Bathrooms = 6,
                        CarSpots = 4,
                        Description = "Exclusive beachfront villa with infinity pool and panoramic ocean views.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1600047509807-ba8f99d5b1c4",
                            "https://images.unsplash.com/photo-1616594039964-a756dd0c71b1"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Downtown Luxury Condo",
                        Address = "Tower 5, Clifton, Karachi",
                        Price = 21000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 2,
                        Bathrooms = 2,
                        CarSpots = 1,
                        Description = "Luxury condo with skyline view, modern interiors, and access to gym & pool.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Country Farmhouse Retreat",
                        Address = "Green Valley Road, Murree",
                        Price = 28000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 4,
                        Bathrooms = 3,
                        CarSpots = 2,
                        Description = "Peaceful farmhouse surrounded by hills, perfect for weekend getaways.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1475855581690-80accde3ae2b",
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Student Housing Apartment",
                        Address = "Near Punjab University, Lahore",
                        Price = 25000,
                        ListingType = ListingType.Rent,
                        Bedrooms = 2,
                        Bathrooms = 1,
                        CarSpots = 0,
                        Description = "Affordable student apartment close to campus with shared facilities.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Luxury Mountain Cabin",
                        Address = "Snow Peak Heights, Gilgit",
                        Price = 45000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 3,
                        Bathrooms = 2,
                        CarSpots = 2,
                        Description = "Wooden cabin with panoramic mountain views and cozy fireplace.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1542317854-f9596ae5700c",
                            "https://images.unsplash.com/photo-1600585154781-04f3c5f4e7a5"
                        }
                    },
                    new Property
                    {
                        Id = Guid.NewGuid(),
                        Title = "Small Townhouse",
                        Address = "Street 12, Bahria Town, Rawalpindi",
                        Price = 9000000,
                        ListingType = ListingType.Sale,
                        Bedrooms = 2,
                        Bathrooms = 2,
                        CarSpots = 1,
                        Description = "Modern townhouse ideal for small families, located in a secure community.",
                        ImageUrls = new List<string>
                        {
                            "https://images.unsplash.com/photo-1600585154409-03e88b7c97c5"
                        }
                    }
                };

                context.Properties.AddRange(properties);
                context.SaveChanges();
            }
        }
    }
}
