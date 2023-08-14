namespace SdeResearchApi.Entities.Dtos.Media
{
    public class GetSignedUrlResponseDto
    {
        public string BucketName { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
