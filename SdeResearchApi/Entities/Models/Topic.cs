using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SdeResearchApi.Entities.Models
{
    public class Topic
    {
        [Key]
        public int TopicId { get; set; }

        [Required]
        public string TopicName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsTopicPagePublished { get; set; } = false;

        public TopicDetails? Details { get; set; }
        public virtual List<TopicCategory> TopicCategories { get; set; } = new();
    }

    public class TopicDetails
    {
        [Key]
        public int TopicDetailsId { get; set; }
        [ForeignKey("Topic")]
        public int TopicId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string ImageKey { get; set; } = string.Empty;
        public virtual Topic? Topic { get; set; }
        [ForeignKey("ResearcherId")]
        public int ResearcherId { get; set; }
        public Researcher? Researcher { get; set; }
        public virtual List<TopicSection>? Sections { get; set; }
    }

    public class TopicSection
    {
        [Key]
        public int SectionId { get; set; }
        public int DisplayOrder { get; set; }
        [ForeignKey("TopicDetails")]
        public int TopicDetailsId { get; set; }
        public string? SectionTitle { get; set; }
        public string? SectionBody { get; set; }
        public virtual TopicDetails? TopicDetails { get; set; }
    }
}