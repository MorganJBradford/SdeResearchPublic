using System.ComponentModel.DataAnnotations;

namespace SdeResearchApi.Entities.Models
{
    public class PublicationTopicCategory
    {
        [Key]
        public int PublicationTopicCategoryId { get; set; }
        public int PublicationId { get; set; }
        public int TopicCategoryId { get; set; }
        public Publication Publication { get; set; } = null!;
        public TopicCategory TopicCategory { get; set; } = null!;
    }
}
