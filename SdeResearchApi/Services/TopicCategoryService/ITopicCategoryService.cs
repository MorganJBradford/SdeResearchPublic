using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.TopicCategory;
using SdeResearchApi.Entities.Dtos.TopicCategoryDtos;

namespace SdeResearchApi.Services.TopicCategoryService
{
    public interface ITopicCategoryService
    {
        Task<DataServiceResponse<GetTopicCategoriesByIdSotredByTopicResponseDto>> GetSortedTopicCategoriesByTopicId(List<int> topicId);
        Task<DataServiceResponse<SortedTopicsAndCategoriesResponseDto>> GetSortedTopicsAndCategoriesAsync();
        Task<DataServiceResponse<GetPublicationsPageResponseDto>> GetPublicationsPage(string publicationType);
    }
}
