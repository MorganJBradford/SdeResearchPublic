namespace SdeResearchApi.Entities.Dtos.TopicCategory
{
    public class TopicManagerTopicDto
    {
        public int TopicId { get; set; }
        public string TopicName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsTopicPagePublished { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}
