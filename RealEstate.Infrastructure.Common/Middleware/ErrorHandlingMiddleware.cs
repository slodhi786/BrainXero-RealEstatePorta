using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RealEstate.Presentation.Contracts.Common;
using System.Text.Json;

namespace RealEstate.Infrastructure.Common.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly bool _isDevelopment;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger, bool isDevelopment)
        {
            _next = next;
            _logger = logger;
            _isDevelopment = isDevelopment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");

                var details = _isDevelopment ? ex.Message : null;
                var payload = new
                {
                    details,
                    traceId = context.TraceIdentifier
                };

                var resp = ApiResponse<object>.Fail(StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred.", payload);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = resp.StatusCode;

                var jsonResponse = JsonSerializer.Serialize(resp);
                await context.Response.WriteAsync(jsonResponse);
            }
        }
    }
}
