using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Media;
using SdeResearchApi.Services.MediaService;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _s3Service;

        public MediaController(IMediaService s3Service)
        {
            _s3Service = s3Service;
        }

        [HttpGet("get-profile-picture-upload-url")]
        public async Task<ActionResult<DataServiceResponse<GetSignedUrlResponseDto>>> GetPresignedProfilePictureUploadUrlAsync()
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = await _s3Service.GeneratePresignedProfilePictureUploadUrl(token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("admin-researcher-profile-picture-url/{researcherId}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<DataServiceResponse<GetSignedUrlResponseDto>>> AdminResearchPictureUploadUrlAsync(int researcherId)
        {
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = await _s3Service.AdminResearchPictureUploadUrlAsync(researcherId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-publication-upload-url")]
        public async Task<ActionResult<DataServiceResponse<GetSignedUrlResponseDto>>> GetPresignedPublicationUploadUrlAsync([FromQuery(Name = "key")]string? publicationKey)
        {
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = await _s3Service.GeneratePresignedPublicationUploadUrl(publicationKey);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("topic-picture-upload-url")]
        public async Task<ActionResult<DataServiceResponse<GetSignedUrlResponseDto>>> GetPresignedTopicUploadUrlAsync([FromQuery(Name = "detailsId")] int detailsId, [FromQuery(Name = "key")] string? imageKey)
        {
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = await _s3Service.GetPresignedTopicUploadUrlAsync(detailsId, imageKey);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("delete-publication")]
        public async Task<ActionResult<ServiceResponse>> DeletePublicationAsync([FromQuery(Name = "key")] string publicationKey)
        {
            ServiceResponse serviceResponse = await _s3Service.DeletePublicationAsync(publicationKey);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("delete-topic-picture")]
        public async Task<ActionResult<ServiceResponse>> DeleteTopicPhotoAsync([FromQuery(Name = "key")] string photoKey)
        {
            ServiceResponse serviceResponse = await _s3Service.DeleteTopicPhotoAsync(photoKey);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
