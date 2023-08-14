using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.PublicationDtos;
using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Services.PublicationService
{
    public interface IPublicationService
    {
        Task<ServiceResponse> CreatePublicationAsync(CreatePublicationRequestDto request);
        Task<DataServiceResponse<GetPublicationsSortedByTypeResponseDto>> GetPublicationsSortedByTypeAsync();
        Task<ServiceResponse> UpdatePublicationAsync(UpdatePublicationRequestDto request);
        Task<DataServiceResponse<List<Publication>>> GetPublicationsByCategoryAndTopicIdsAsync(int categoryId, int topicId);
        Task<ServiceResponse> DeletePublicationAsync(int publicationId);
        Task<ServiceResponse> PublishPublicationAsync(int publicationId);
    }
}
