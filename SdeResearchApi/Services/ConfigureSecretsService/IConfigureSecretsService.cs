namespace SdeResearchApi.Services.ConfigureSecretsService
{
    public interface IConfigureSecretsService
    {
        Task StartAsync(CancellationToken cancellationToken);
        Task StopAsync(CancellationToken cancellationToken);
    }
}