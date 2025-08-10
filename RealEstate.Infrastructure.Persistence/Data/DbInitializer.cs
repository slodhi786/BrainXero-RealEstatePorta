using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Enums;
using RealEstate.Infrastructure.Common.Helpers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RealEstate.Infrastructure.Persistence.Data
{
    public static class DbInitializer
    {
        public class SeedOptions
        {
            public string FilePath { get; set; }              // e.g. "Seed/properties-seed.json"
            public string FallbackImage { get; set; }         // e.g. "src/assets/images/placeholder-property.webp"
            public bool ValidateImages { get; set; } = true;
            public int MaxParallelChecks { get; set; } = 8;
            public int HeadTimeoutSeconds { get; set; } = 2;
        }

        /// <summary>
        /// Infrastructure-level seeding with no dependency on IConfiguration or IWebHostEnvironment.
        /// Pass in options + contentRootPath + webRootPath from WebApi.
        /// </summary>
        public static async Task SeedAsync(
            ApplicationDbContext context,
            ILogger logger,
            SeedOptions options,
            string contentRootPath,   // app root (Program.cs: builder.Environment.ContentRootPath)
            string webRootPath        // wwwroot (Program.cs: app.Environment.WebRootPath ?? Path.Combine(contentRootPath, "wwwroot"))
        )
        {
            await context.Database.EnsureCreatedAsync();

            if (await context.Properties.AnyAsync())
            {
                logger.LogInformation("Properties already exist. Skipping seed.");
                return;
            }

            // Resolve seed file path against content root
            var seedRelative = string.IsNullOrWhiteSpace(options.FilePath)
                ? "Seed/properties-seed.json"
                : options.FilePath!;
            var seedPath = Path.IsPathRooted(seedRelative)
                ? seedRelative
                : Path.Combine(contentRootPath, seedRelative);

            if (!File.Exists(seedPath))
            {
                logger.LogError("Seed file not found at {Path}. Aborting seeding.", seedPath);
                return;
            }

            var fallbackImage = string.IsNullOrWhiteSpace(options.FallbackImage)
                ? "src/assets/images/placeholder-property.webp"
                : options.FallbackImage!;

            var json = await File.ReadAllTextAsync(seedPath);
            var serializerOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new JsonStringEnumConverter() }
            };

            List<Property>? items;
            try
            {
                items = JsonSerializer.Deserialize<List<Property>>(json, serializerOptions);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to deserialize properties seed JSON.");
                return;
            }

            if (items is null || items.Count == 0)
            {
                logger.LogWarning("Seed file is empty or invalid.");
                return;
            }

            if (options.ValidateImages)
            {
                logger.LogInformation("Validating images for {Count} properties…", items.Count);

                var throttler = new SemaphoreSlim(Math.Max(1, options.MaxParallelChecks));
                var tasks = items.Select(async p =>
                {
                    await throttler.WaitAsync();
                    try
                    {
                        p.ImageUrls ??= new List<string>();
                        if (string.IsNullOrWhiteSpace(p.Address))
                            p.Address = p.Location ?? p.City ?? "";

                        if (string.IsNullOrWhiteSpace(p.Status))
                            p.Status = p.ListingType == ListingType.Rent ? "For Rent" : "For Sale";

                        await PropertyImageValidator.NormalizeAndValidateAsync(
                            p,
                            fallbackImage: fallbackImage,
                            contentRoot: contentRootPath,
                            webRoot: webRootPath,
                            headTimeoutSeconds: options.HeadTimeoutSeconds
                        );
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Validation failed for property {Id}. Using fallback image.", p.Id);
                        p.ImageUrls = new List<string> { fallbackImage };
                        p.ThumbnailUrl = fallbackImage;
                    }
                    finally
                    {
                        throttler.Release();
                    }
                });

                await Task.WhenAll(tasks);
                logger.LogInformation("Image validation complete.");
            }
            else
            {
                foreach (var p in items)
                {
                    p.ImageUrls ??= new List<string>();
                    if (string.IsNullOrWhiteSpace(p.ThumbnailUrl))
                        p.ThumbnailUrl = p.ImageUrls.FirstOrDefault() ?? fallbackImage;
                }
            }

            await context.Properties.AddRangeAsync(items);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} properties from JSON.", items.Count);
        }
    }
}
