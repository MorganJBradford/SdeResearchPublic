using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Entities.Dtos.TopicDtos
{
    public class UpdateTopicDetailsRequestDto
    {
        public int TopicId { get; set; }
        public int? TopicDetailsId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string ImageKey { get; set; } = string.Empty;
        public List<TopicSection> Sections { get; set; } = new List<TopicSection>();
    }

    public class SectionsRequestDto
    {
        public int? SectionId { get; set; }
        public int? TopicDetailsId { get; set; }
        public string? SectionTitle { get; set; }
        public string? SectionBody { get; set; }
        public virtual TopicDetails? TopicDetails { get; set; }
    }
}
