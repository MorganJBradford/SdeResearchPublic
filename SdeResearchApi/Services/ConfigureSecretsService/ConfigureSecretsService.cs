using Amazon.SecretsManager.Model;
using Amazon.SecretsManager;
using System.Net;
using SdeResearchApi.Services.SecretsService;
using Newtonsoft.Json;

namespace SdeResearchApi.Services.ConfigureSecretsService
{
    public class ConfigureSecretsService : IHostedService
    {
        private readonly IAmazonSecretsManager _secretsManager;
        private readonly ISecretsService _secretsService;

        public ConfigureSecretsService(ISecretsService secretsService)
        {
            _secretsManager = new AmazonSecretsManagerClient();
            _secretsService = secretsService;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            // Single secret containing multiple key-value pairs.
            var secretName = "sderesearchgroup/prod";

            var response = await _secretsManager.GetSecretValueAsync(new GetSecretValueRequest { SecretId = secretName });

            if (response.HttpStatusCode == HttpStatusCode.OK)
            {
                // Assuming that the secret value is a JSON string representing a dictionary of key-value pairs.
                var secrets = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.SecretString);
                _secretsService.LoadAppSettings(secrets);
            }
            else
            {
                throw new Exception($"Failed to retrieve the secret {secretName}: {response.HttpStatusCode}");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            // No-op
            return Task.CompletedTask;
        }
    }
}
