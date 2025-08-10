using Microsoft.AspNetCore.Http;

namespace RealEstate.Presentation.Contracts.Common
{
    public sealed class ApiResponse<T>
    {
        public int StatusCode { get; init; }
        public bool Success { get; init; }
        public string Message { get; init; } = string.Empty;
        public T? Data { get; init; }

        public static ApiResponse<T> Ok(T? data, string message = "")
            => new() { StatusCode = StatusCodes.Status200OK, Success = true, Message = message, Data = data };

        public static ApiResponse<T> Created(T? data, string message = "")
            => new() { StatusCode = StatusCodes.Status201Created, Success = true, Message = message, Data = data };

        public static ApiResponse<T> Fail(int statusCode, string message, T? data = default)
            => new() { StatusCode = statusCode, Success = false, Message = message, Data = data };
    }
}
