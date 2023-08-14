using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Entities.Dtos.TopicCategory
{
    public class SortedTopicsAndCategoriesResponseDto
    {
        public List<TopicManagerTopicDto> AcademicTopics { get; set; } = new();
        public List<TopicManagerTopicDto> PractitionerTopics { get; set; } = new();
        public List<TopicManagerCategoryDto> AcademicCategories { get; set; } = new();
        public List<TopicManagerCategoryDto> PractitionerCategories { get; set; } = new();
    }
}