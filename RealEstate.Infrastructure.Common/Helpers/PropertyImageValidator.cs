using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Common.Helpers
{
    public static class PropertyImageValidator
    {
        // Reuse one HttpClient for performance
        private static readonly HttpClient _http = new HttpClient(new SocketsHttpHandler
        {
            PooledConnectionLifetime = TimeSpan.FromMinutes(10),
            AutomaticDecompression = System.Net.DecompressionMethods.All
        })
        {
            Timeout = TimeSpan.FromSeconds(2)
        };

        /// <summary>
        /// Validate and normalize a property's ThumbnailUrl and ImageUrls.
        /// Replaces any broken links with the configured fallback.
        /// </summary>
        public static async Task NormalizeAndValidateAsync(
            Property p,
            string fallbackImage,
            string contentRoot,
            string webRoot,
            int headTimeoutSeconds = 2)
        {
            // Ensure list exists
            p.ImageUrls ??= new List<string>();

            // Clean list (dedupe, trim empties)
            var cleaned = p.ImageUrls
                .Where(u => !string.IsNullOrWhiteSpace(u))
                .Select(u => u.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            // Validate each; keep only valid or local existing
            var validUrls = new List<string>(cleaned.Count);
            foreach (var url in cleaned)
            {
                if (await IsAvailableAsync(url, contentRoot, webRoot, headTimeoutSeconds))
                    validUrls.Add(url);
            }

            // If nothing valid, use fallback
            if (validUrls.Count == 0)
                validUrls.Add(fallbackImage);

            p.ImageUrls = validUrls;

            // Thumbnail: prefer explicit if valid, else first valid image, else fallback
            var thumb = !string.IsNullOrWhiteSpace(p.ThumbnailUrl) ? p.ThumbnailUrl.Trim() : null;

            if (!string.IsNullOrEmpty(thumb) && await IsAvailableAsync(thumb!, contentRoot, webRoot, headTimeoutSeconds))
            {
                p.ThumbnailUrl = thumb!;
            }
            else
            {
                p.ThumbnailUrl = p.ImageUrls.FirstOrDefault() ?? fallbackImage;
            }
        }

        /// <summary>
        /// Returns true if URL is available (local file exists or remote HEAD returns 2xx).
        /// </summary>
        public static async Task<bool> IsAvailableAsync(string url, string contentRoot, string webRoot, int headTimeoutSeconds)
        {
            // Local or app-served path (e.g., "/images/foo.webp" or "images/foo.webp")
            if (!url.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            {
                var path = url.StartsWith("/") ? url.Substring(1) : url;
                var disk = Path.Combine(webRoot, path.Replace("/", Path.DirectorySeparatorChar.ToString()));
                return File.Exists(disk);
            }

            // Remote: do a quick HEAD
            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(Math.Max(1, headTimeoutSeconds)));
                using var req = new HttpRequestMessage(HttpMethod.Head, url);
                using var resp = await _http.SendAsync(req, cts.Token);
                return (int)resp.StatusCode >= 200 && (int)resp.StatusCode < 300;
            }
            catch
            {
                return false;
            }
        }
    }
}
