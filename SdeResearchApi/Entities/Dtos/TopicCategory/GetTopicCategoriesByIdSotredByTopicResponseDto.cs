namespace SdeResearchApi.Entities.Dtos.TopicCategoryDtos
{
    public class GetTopicCategoriesByIdSotredByTopicResponseDto
    {
        public List<TopicIdNameTopicCategoriesDto> CategoriesByTopic { get; set; } = new();
    }

    public class TopicIdNameTopicCategoriesDto
    {
        public int TopicId { get; set; }
        public string TopicName { get; set; } = string.Empty;
        public List<TopicCategoryIdCategoryNameDto> TopicCategories { get; set; } = new();
    }

    public class TopicCategoryIdCategoryNameDto
    {
        public int TopicCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
