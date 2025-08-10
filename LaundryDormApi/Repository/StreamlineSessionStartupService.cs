namespace LaundryDormApi.Repository
{
    public class StreamlineSessionStartupService : IHostedService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromHours(5);
        
        public StreamlineSessionStartupService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task StartAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var streamlineSession = scope.ServiceProvider.GetRequiredService<IStreamlineSession>();
                    await streamlineSession.UpdateSession(stoppingToken);
                }
                await Task.Delay(_interval, stoppingToken);
            }
            
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask; // No specific action needed on stop
    }
}
