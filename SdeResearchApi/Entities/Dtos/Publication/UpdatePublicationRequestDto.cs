namespace SdeResearchApi.Entities.Dtos.PublicationDtos
{
    public class UpdatePublicationRequestDto
    {
        public int PublicationId { get; set; }
        public string Citation { get; set; } = string.Empty;
        public string LinkToSource { get; set; } = string.Empty;
        public string PublicationKey { get; set; } = string.Empty;
        public string PublicationUrl { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<int> TopicCategoryIds { get; set; } = new();
    }
}
