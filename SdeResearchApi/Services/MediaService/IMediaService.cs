using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Media;

namespace SdeResearchApi.Services.MediaService
{
    public interface IMediaService
    {
        Task<DataServiceResponse<GetSignedUrlResponseDto>> GeneratePresignedProfilePictureUploadUrl(string authToken);
        Task<DataServiceResponse<GetSignedUrlResponseDto>> AdminResearchPictureUploadUrlAsync(int researcherId);
        Task<DataServiceResponse<GetSignedUrlResponseDto>> GeneratePresignedPublicationUploadUrl(string? publicationKey);
        Task<DataServiceResponse<GetSignedUrlResponseDto>> GetPresignedTopicUploadUrlAsync(int detailsId, string? imageKey);
        Task<ServiceResponse> DeletePublicationAsync(string publicationKey);
        Task<ServiceResponse> DeleteTopicPhotoAsync(string photoKey);
    }
}
