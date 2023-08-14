namespace SdeResearchApi.Entities.Data
{
    public class AppSettings
    {
        public string DbConnection { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;
        public string AccessKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
