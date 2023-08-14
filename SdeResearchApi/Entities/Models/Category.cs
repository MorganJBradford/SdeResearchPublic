using System.ComponentModel.DataAnnotations;

namespace SdeResearchApi.Entities.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public virtual List<TopicCategory> TopicCategories { get; set; } = new();
    }
}
