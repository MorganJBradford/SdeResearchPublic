using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.PublicationDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.PublicationService;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PublicationController : ControllerBase
    {
        private readonly IPublicationService _publicationService;

        public PublicationController(IPublicationService publicationService)
        {
            _publicationService = publicationService;
        }

        [HttpGet("get-publications-sorted-by-type"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<DataServiceResponse<GetPublicationsSortedByTypeResponseDto>>> GetPublicationsSortedByTypeAsync()
        {
            DataServiceResponse<GetPublicationsSortedByTypeResponseDto> serviceResponse = await _publicationService.GetPublicationsSortedByTypeAsync();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-publications-by-category-and-topic-id")]
        public async Task<ActionResult<DataServiceResponse<List<Publication>>>> GetPublicationsByCategoryAndTopicIdsAsync([FromQuery(Name = "categoryId")] int categoryId, [FromQuery(Name = "topicId")]int topicId)
        {
            DataServiceResponse<List<Publication>> serviceResponse = await _publicationService.GetPublicationsByCategoryAndTopicIdsAsync(categoryId, topicId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }



        [HttpPost("create-publication"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ServiceResponse>> CreatePublicationAsync([FromBody] CreatePublicationRequestDto request)
        {
            ServiceResponse serviceResponse = await _publicationService.CreatePublicationAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("update-publication"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> UpdatePublicationAsync([FromBody] UpdatePublicationRequestDto request)
        {
            ServiceResponse serviceResponse = await _publicationService.UpdatePublicationAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("delete-publication"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> DeletePublicationAsync([FromQuery(Name = "id")] int publicationId)
        {
            ServiceResponse serviceResponse = await _publicationService.DeletePublicationAsync(publicationId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("publish-publication"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> PublishPublicationAsync([FromQuery(Name = "id")] int publicationId)
        {
            ServiceResponse serviceResponse = await _publicationService.PublishPublicationAsync(publicationId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
