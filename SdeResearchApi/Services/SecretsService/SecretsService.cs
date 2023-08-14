using SdeResearchApi.Entities.Data;

namespace SdeResearchApi.Services.SecretsService
{
    public class SecretsService : ISecretsService
    {
        private AppSettings _appSettings;

        public SecretsService()
        {
            _appSettings = new AppSettings();
        }
        public void LoadAppSettings(Dictionary<string, string> secrets)
        {
            string[] requiredKeys = new string[] { "dbconnection", "bucket-name", "secret-token" };

            foreach (string key in requiredKeys)
            {
                if (!secrets.ContainsKey(key))
                {
                    throw new Exception($"Secrets must contain key {key}");
                }
            }

            // Replace the default instance with the new AppSettings based on the loaded secrets
            _appSettings = new AppSettings
            {
                DbConnection = secrets["dbconnection"],
                BucketName = secrets["bucket-name"],
                Token = secrets["secret-token"]
            };
        }

        public AppSettings GetAppSettings()
        {
            return _appSettings;
        }
    }
}