using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.NewsDtos;
using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Services.NewsService
{
    public interface INewsService
    {
        public Task<DataServiceResponse<List<LatestNewsResponseDto>>> GetLatestNews();
        public Task<ServiceResponse> AddNews(AddNewsRequestDto request);
        public Task<ServiceResponse> UpdateNewsItem(UpdateNewsItemRequestDto request);
        public Task<ServiceResponse> DeleteNewsItemById(int id);
    }
}
