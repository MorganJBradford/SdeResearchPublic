namespace SdeResearchApi.Entities.Dtos.TopicDtos
{
    public class CreateTopicRequestDto
    {
        public string TopicName { get; set; } = string.Empty;
        public List<int> CategoryIds { get; set; } = new ();
        public string Type { get; set; } = string.Empty;
    }
}
