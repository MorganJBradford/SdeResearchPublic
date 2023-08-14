namespace SdeResearchApi.Entities.Models
{
    public class Publication
    {
        public int PublicationId { get; set; }
        public string Citation { get; set; } = string.Empty;
        public string LinkToSource { get; set; } = string.Empty;
        public string PublicationKey { get; set; } = string.Empty;
        public string PublicationUrl { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public bool IsPublished { get; set; } = false;
        public string Type { get; set; } = string.Empty;
        public virtual List<PublicationTopicCategory> PublicationTopicCategories { get; set; } = new();
    }
}
