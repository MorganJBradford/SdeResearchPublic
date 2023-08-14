using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.NewsDtos;
using SdeResearchApi.Entities.Models;
using System.Net;

namespace SdeResearchApi.Services.NewsService
{

    public class NewsService : INewsService
    {
        private readonly SdeResearchDbContext _db;
        public NewsService(SdeResearchDbContext db)
        {
            _db = db;
        }
        public async Task<DataServiceResponse<List<LatestNewsResponseDto>>> GetLatestNews()
        {
            DataServiceResponse<List<LatestNewsResponseDto>> serviceResponse = new DataServiceResponse<List<LatestNewsResponseDto>>();
            List<LatestNewsResponseDto> newsResponseDtos = new();
            List<News> latestNews = await _db.News.Take(3).OrderByDescending(x => x.CreatedAt).ToListAsync();

            if (latestNews == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No news available";
                return serviceResponse;
            }

            foreach (var item in latestNews)
            {
                LatestNewsResponseDto responseDto = new()
                {
                    Id = item.Id,
                    Title = item.Title,
                    Body = item.Body,
                    CreatedAt = item.CreatedAt.ToString("MM/dd/yyyy hh:mm tt"),
                    UpdatedAt = item.UpdatedAt.ToString("MM/dd/yyyy hh:mm tt")
                };


                newsResponseDtos.Add(responseDto);
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            serviceResponse.Data = newsResponseDtos;
            return serviceResponse;
        }

        public async Task<ServiceResponse> AddNews(AddNewsRequestDto request)
        {
            var serviceResponse = new ServiceResponse();
            News newsToAdd = new()
            {
                Title = request.Title,
                Body = request.Body,
            };

            await _db.News.AddAsync(newsToAdd);
            bool isAdded = await _db.SaveChangesAsync() > 0;

            if (!isAdded)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }
        public async Task<ServiceResponse> UpdateNewsItem(UpdateNewsItemRequestDto request)
        {
            var serviceResponse = new ServiceResponse();
            News? newsFromDb = await _db.News.FirstOrDefaultAsync(news => news.Id == request.Id);

            if (newsFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "News post not found";
                return serviceResponse;
            }

            newsFromDb.Title = request.Title;
            newsFromDb.Body = request.Body;
            newsFromDb.UpdatedAt = DateTime.UtcNow;

            _db.News.Update(newsFromDb);
            bool isUpdated = await _db.SaveChangesAsync() > 0;

            if (!isUpdated)
            {
                serviceResponse.StatusCode= HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Update successful";
            return serviceResponse;

        }
        public async Task<ServiceResponse> DeleteNewsItemById(int id)
        {
            var serviceResponse = new ServiceResponse();
            News? newsToDelete = await _db.News.FirstOrDefaultAsync(x => x.Id == id);

            if (newsToDelete == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "News item not found";
                return serviceResponse;
            }

            _db.News.Remove(newsToDelete);
            bool isDeleted = await _db.SaveChangesAsync() > 0;

            if (!isDeleted)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Deleted successfully";
            return serviceResponse;
        }
    }
}
