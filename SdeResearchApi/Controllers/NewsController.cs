using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.NewsDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.NewsService;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        // Refactor typing and responses
        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet("get-latest-news"), AllowAnonymous]
        public async Task<ActionResult<DataServiceResponse<List<LatestNewsResponseDto>>>> GetLatestNewAsync()
        {
            DataServiceResponse<List<LatestNewsResponseDto>> serviceResponse = await _newsService.GetLatestNews();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("add-news")]
        public async Task<ActionResult<ServiceResponse>> AddNewsAsync(AddNewsRequestDto request)
        {
            ServiceResponse serviceResponse = await _newsService.AddNews(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("update-news-item")]
        public async Task<ActionResult<ServiceResponse>> UpdateNewsItemAsync(UpdateNewsItemRequestDto request)
        {
            ServiceResponse serviceResponse = await _newsService.UpdateNewsItem(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("delete-news-item-by-id/{id}")]
        public async Task<ActionResult<ServiceResponse>> DeleteNewsItemByIdAsync(int id)
        {
            ServiceResponse serviceResponse = await _newsService.DeleteNewsItemById(id);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
