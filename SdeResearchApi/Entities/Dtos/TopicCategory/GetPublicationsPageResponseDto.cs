using SdeResearchApi.Entities.Dtos.PublicationDtos;

namespace SdeResearchApi.Entities.Dtos.TopicCategory
{

    public class GetPublicationsPageResponseDto
    {
        public List<PublicationCategoryDto> Categories { get; set; } = new();
    }
}
