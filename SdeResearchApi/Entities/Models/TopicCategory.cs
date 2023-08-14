using System.ComponentModel.DataAnnotations;

namespace SdeResearchApi.Entities.Models
{
    public class TopicCategory
    {
        [Key]
        public int TopicCategoryId { get; set; }
        public int TopicId { get; set; }
        public int CategoryId { get; set; }
        public Topic Topic { get; set; } = null!;
        public Category Category { get; set; } = null!;
        public List<PublicationTopicCategory> PublicationTopicCategories { get; set; } = new();
    }
}
