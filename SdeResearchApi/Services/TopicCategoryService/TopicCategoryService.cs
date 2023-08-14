using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.PublicationDtos;
using SdeResearchApi.Entities.Dtos.TopicCategory;
using SdeResearchApi.Entities.Dtos.TopicCategoryDtos;
using SdeResearchApi.Entities.Models;
using System.Net;

namespace SdeResearchApi.Services.TopicCategoryService
{
    public class TopicCategoryService : ITopicCategoryService
    {
        private readonly SdeResearchDbContext _db;

        public TopicCategoryService(SdeResearchDbContext db)
        {
            _db = db;
        }

        public async Task<DataServiceResponse<GetPublicationsPageResponseDto>> GetPublicationsPage(string publicationType)
        {
            List<TopicCategory> topicCategories = await _db.TopicCategories
                .Include(tc => tc.Category)
                .Include(tc => tc.Topic)
                .Where(tc => tc.Category.Type == publicationType && tc.PublicationTopicCategories.Where(p => p.Publication.IsPublished == true).Any())
                .ToListAsync();

            // Group by category
            var categoriesGrouped = topicCategories
                .GroupBy(tc => tc.Category)
                .Select(cg => new PublicationCategoryDto
                {
                    CategoryId = cg.Key.CategoryId,
                    CategoryName = cg.Key.CategoryName,
                    Topics = cg
                        .GroupBy(tc => tc.Topic)
                        .Select(tg => new PublicationTopicDto
                        {
                            TopicId = tg.Key.TopicId,
                            TopicName = tg.Key.TopicName,
                        })
                        .ToList()
                })
                .ToList();

            var response = new GetPublicationsPageResponseDto
            {
                Categories = categoriesGrouped
            };

            if (!categoriesGrouped.Any())
            {
                return new DataServiceResponse<GetPublicationsPageResponseDto>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Data = response,
                    Message = "No Data"
                };
            }

            return new DataServiceResponse<GetPublicationsPageResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Data = response,
                Message = $"Successfully {publicationType} publications page"
            };
        }
        public async Task<DataServiceResponse<GetTopicCategoriesByIdSotredByTopicResponseDto>> GetSortedTopicCategoriesByTopicId(List<int> topicIds)
        {
            DataServiceResponse<GetTopicCategoriesByIdSotredByTopicResponseDto> serviceResponse = new();
            GetTopicCategoriesByIdSotredByTopicResponseDto responseDto = new();
            List<int> sortedTopicIds = topicIds.OrderBy(id => id).ToList();
            foreach (int topicId in sortedTopicIds)
            {
                string topicName = await _db.Topics.Where(t => t.TopicId == topicId).Select(t => t.TopicName).FirstAsync();

                List<TopicCategoryIdCategoryNameDto> topicCategories = await _db.TopicCategories
                    .Where(tc => tc.TopicId == topicId)
                    .Include(tc => tc.Category)
                    .OrderBy(tc => tc.CategoryId)
                    .Select(tc => new TopicCategoryIdCategoryNameDto
                    {
                        TopicCategoryId = tc.TopicCategoryId,
                        CategoryName = tc.Category.CategoryName
                    })
                    .ToListAsync();

                TopicIdNameTopicCategoriesDto topicDto = new()
                {
                    TopicId = topicId,
                    TopicName = topicName,
                    TopicCategories = topicCategories
                };

                responseDto.CategoriesByTopic.Add(topicDto);
            }

            if (!responseDto.CategoriesByTopic.Any())
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No categories are associated with these topics";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Data = responseDto;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<DataServiceResponse<SortedTopicsAndCategoriesResponseDto>> GetSortedTopicsAndCategoriesAsync()
        {
            DataServiceResponse<SortedTopicsAndCategoriesResponseDto> serviceResponse = new();
            var categories = await _db.Categories.Include(c => c.TopicCategories).ToListAsync();
            var topics = await _db.Topics.Include(t => t.TopicCategories).ToListAsync();

            var response = new SortedTopicsAndCategoriesResponseDto
            {
                AcademicTopics = topics
                    .Where(t => t.Type == "academic")
                    .Select(t => new TopicManagerTopicDto
                    {
                        TopicId = t.TopicId,
                        TopicName = t.TopicName,
                        Type = t.Type,
                        IsTopicPagePublished = t.IsTopicPagePublished,
                        CategoryIds = t.TopicCategories
                            .Where(tc => tc.TopicId == t.TopicId)
                            .Select(tc => tc.CategoryId)
                            .ToList()
                    }).ToList(),

                PractitionerTopics = topics
                    .Where(t => t.Type == "practitioner")
                    .Select(t => new TopicManagerTopicDto
                    {
                        TopicId = t.TopicId,
                        TopicName = t.TopicName,
                        Type = t.Type,
                        IsTopicPagePublished = t.IsTopicPagePublished,
                        CategoryIds = t.TopicCategories
                            .Where(tc => tc.TopicId == t.TopicId)
                            .Select(tc => tc.CategoryId)
                            .ToList()
                    }).ToList(),

                AcademicCategories = categories
                    .Where(c => c.Type == "academic")
                    .Select(c => new TopicManagerCategoryDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName
                    }).ToList(),

                PractitionerCategories = categories
                    .Where(c => c.Type == "practitioner")
                    .Select(c => new TopicManagerCategoryDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName
                    }).ToList()
            };

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Data = response;
            return serviceResponse;
        }
    }
}
