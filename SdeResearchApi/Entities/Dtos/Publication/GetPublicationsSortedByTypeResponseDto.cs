namespace SdeResearchApi.Entities.Dtos.PublicationDtos
{
    public class GetPublicationsSortedByTypeResponseDto
    {
        public List<AdminPublication> AcademicPublications { get; set; } = new();
        public List<AdminPublication> PractitionerPublications { get; set; } = new();
    }

    public class AdminPublication
    {
        public int PublicationId { get; set; }
        public string Citation { get; set; } = string.Empty;
        public string LinkToSource { get; set; } = string.Empty;
        public string PublicationKey { get; set; } = string.Empty;
        public string PublicationUrl { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public string Type { get; set; } = string.Empty;
        public List<int> TopicIds { get; set; } = new();
        public List<int> TopicCategoryIds { get; set; } = new();
    }
}
