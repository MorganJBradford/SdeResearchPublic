namespace SdeResearchApi.Entities.Dtos.PublicationDtos
{
    public class PublicationTopicDto
    {
        public int TopicId { get; set; }
        public string TopicName { get; set; } = string.Empty;
        public List<BasePublicationDto> Publications { get; set; } = new();
    }
}
