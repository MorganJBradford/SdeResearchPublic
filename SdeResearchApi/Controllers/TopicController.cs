using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Topic;
using SdeResearchApi.Entities.Dtos.TopicDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.TopicService;
using System.Net;

namespace SdeResearchApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TopicController : ControllerBase
    {
        private readonly SdeResearchDbContext _db;
        private readonly ITopicService _topicService;

        public TopicController(SdeResearchDbContext db, ITopicService topicService)
        {
            _db = db;
            _topicService = topicService;
        }

        [HttpGet("get-nav-topics")]
        public async Task<ActionResult<DataServiceResponse<List<TopicIdNameDto>>>> GetNavTopicsAsync()
        {
            DataServiceResponse<List<TopicIdNameDto>> serviceResponse = await _topicService.GetNavTopicsAsync();
            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("any-topics-exist"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<DataServiceResponse<AnyTopicsExistResponseDto>>> AnyTopicsExistAsync()
        {
            DataServiceResponse<AnyTopicsExistResponseDto> serviceResponse = await _topicService.AnyTopicsExistAsync();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-topics-by-type/{topicType}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<DataServiceResponse<List<Topic>>>> GetTopicsByTypeAsync(string topicType)
        {
            DataServiceResponse<List<Topic>> serviceResponse = await _topicService.GetTopicsByType(topicType);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-topic-details-by-id/{topicId}")]
        public async Task<ActionResult<DataServiceResponse<Topic>>> GetTopicDetailsByIdAsync(int topicId)
        {
            DataServiceResponse<Topic> serviceResponse = await _topicService.GetTopicDetailsByIdAsync(topicId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("create-topic"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ServiceResponse>> CreateTopicAsync(CreateTopicRequestDto request)
        {
            ServiceResponse serviceResponse = await _topicService.CreateTopic(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }


        [HttpPut("update-topic-details"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        async public Task<ActionResult<ServiceResponse>> UpdateTopicDetailsAsync(UpdateTopicDetailsRequestDto request)
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            ServiceResponse serviceResponse = await _topicService.UpdateTopicDetailsAsync(request, token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("publish-topic-page"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> PublishTopicPageAsync(PublishTopicPageRequestDto request)
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            ServiceResponse serviceResponse = await _topicService.PublishTopicPage(request, token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("update-base-topic"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> UpdateBaseTopicAsync(UpdateBaseTopicRequestDto request)
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            ServiceResponse serviceResponse = await _topicService.UpdateBaseTopic(request, token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("delete-topic-by-id/{topicId}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> DeleteTopicByIdAsync(int topicId)
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            ServiceResponse serviceResponse = await _topicService.DeleteTopicById(topicId, token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("assign-author"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> AssignAuthorAsync([FromBody] AssignAuthorRequest request)
        {
            var serviceResponse = await _topicService.AssignAuthorAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}