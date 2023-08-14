using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Topic;
using SdeResearchApi.Entities.Dtos.TopicDtos;
using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Services.TopicService
{
    public interface ITopicService
    {
        Task<DataServiceResponse<AnyTopicsExistResponseDto>> AnyTopicsExistAsync();
        Task<DataServiceResponse<List<Topic>>> GetTopicsByType(string topicType);
        Task<DataServiceResponse<Topic>> GetTopicDetailsByIdAsync(int topicId);
        Task<ServiceResponse> UpdateTopicDetailsAsync(UpdateTopicDetailsRequestDto topicToUpdate, string token);
        Task<ServiceResponse> PublishTopicPage(PublishTopicPageRequestDto request, string token);
        Task<ServiceResponse> UpdateBaseTopic(UpdateBaseTopicRequestDto request, string authToken);
        Task<ServiceResponse> DeleteTopicById(int topicId, string authToken);
        Task<ServiceResponse> CreateTopic(CreateTopicRequestDto request);
        Task<DataServiceResponse<List<TopicIdNameDto>>> GetNavTopicsAsync();
        Task<ServiceResponse> AssignAuthorAsync(AssignAuthorRequest request);
    }
}