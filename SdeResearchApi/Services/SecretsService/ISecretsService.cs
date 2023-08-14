using SdeResearchApi.Entities.Data;

namespace SdeResearchApi.Services.SecretsService
{
    public interface ISecretsService
    {
        AppSettings GetAppSettings();
        void LoadAppSettings(Dictionary<string, string> secrets);
    }

}