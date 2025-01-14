using System.Net;

namespace LaundryDormApi.Middlewares
{
    /// <summary>
    /// This is a global exception handler middleware, so we don't need to write try-catch blocks in every controller.
    /// </summary>
    public class ExecptionHandlerMiddleware
    {
        private readonly ILogger<ExecptionHandlerMiddleware> _logger;
        private readonly RequestDelegate _next; // Represents the next middleware in the pipeline.
        public ExecptionHandlerMiddleware(ILogger<ExecptionHandlerMiddleware> logger, RequestDelegate next)
        {
            _logger = logger;
            _next = next;
        }

        /// <summary>
        /// Invokes the middleware to handle exceptions.
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <returns>A task that represents the completion of request processing.</returns>
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                var errorId = Guid.NewGuid();

                _logger.LogError($"Something went wrong: {ex} {ex.Message} {errorId}");
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                httpContext.Response.ContentType = "application/json";

                var error = new
                {
                    id = errorId,
                    ErrorMessage = "Something went wrong, sorry for the inconvenience"
                };

                await httpContext.Response.WriteAsJsonAsync(error);
            }
        }
    }
}
