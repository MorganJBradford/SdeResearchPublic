namespace SdeResearchApi.Entities.Dtos.PublicationDtos
{
    public class PublicationCategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public List<PublicationTopicDto> Topics { get; set; } = new();
    }
}
