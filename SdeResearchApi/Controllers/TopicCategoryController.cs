using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.TopicCategory;
using SdeResearchApi.Entities.Dtos.TopicCategoryDtos;
using SdeResearchApi.Services.TopicCategoryService;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TopicCategoryController : ControllerBase
    {
        private readonly ITopicCategoryService _topicCategoryService;

        public TopicCategoryController(ITopicCategoryService topicCategoryService)
        {
            _topicCategoryService = topicCategoryService;
        }

        [HttpGet("get-publications-page")]
        public async Task<ActionResult<DataServiceResponse<GetPublicationsPageResponseDto>>> GetPublicationsPage([FromQuery(Name = "type")] string publicationType)
        {
            DataServiceResponse<GetPublicationsPageResponseDto> serviceResponse = await _topicCategoryService.GetPublicationsPage(publicationType);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-sorted-topic-category-by-topic-ids")]
        public async Task<ActionResult<DataServiceResponse<GetTopicCategoriesByIdSotredByTopicResponseDto>>> GetSortedTopicCategoriesByTopicIdAsync([FromQuery] string topicIds)
        {
            List<int> parsedTopicIds = topicIds.Split(',').Select(int.Parse).ToList();
            DataServiceResponse<GetTopicCategoriesByIdSotredByTopicResponseDto> serviceResponse = await _topicCategoryService.GetSortedTopicCategoriesByTopicId(parsedTopicIds);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("sorted-topics-and-categories"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task <ActionResult<DataServiceResponse<SortedTopicsAndCategoriesResponseDto>>> GetSortedTopicsAndCategoriesAsync()
        {
            DataServiceResponse<SortedTopicsAndCategoriesResponseDto> serviceResponse = await _topicCategoryService.GetSortedTopicsAndCategoriesAsync();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
