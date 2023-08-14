using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Media;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.SecretsService;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace SdeResearchApi.Services.MediaService
{
    public class MediaService : IMediaService
    {
        private readonly SdeResearchDbContext _db;
        private readonly ISecretsService _secretsService;
        private readonly AmazonS3Client _s3Client;
        private readonly string _bucketName;

        public MediaService(ISecretsService secretService, SdeResearchDbContext db)
        {
            _secretsService = secretService;
            _db = db;

            var appSettings = _secretsService.GetAppSettings();
            _bucketName = appSettings.BucketName;
            _s3Client = new AmazonS3Client();
        }

        public async Task<DataServiceResponse<GetSignedUrlResponseDto>> GeneratePresignedProfilePictureUploadUrl(string authToken)
        {
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = new();
            Researcher? researcherFromAuth = await GetResearcherFromToken(authToken);

            string s3ObjectKey;

            if (researcherFromAuth == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }

            if (researcherFromAuth.ImageName != "")
                s3ObjectKey = researcherFromAuth.ImageName; 
            else
                s3ObjectKey = $"Pictures/Researchers/{GenerateS3ObjectKey()}";

            try
            {
                GetPreSignedUrlRequest getPreSignedUrlRequest = new()
                {
                    BucketName = _bucketName,
                    Key = s3ObjectKey,
                    ContentType = "image/*",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                GetSignedUrlResponseDto dto = new()
                {
                    BucketName = getPreSignedUrlRequest.BucketName,
                    Key = getPreSignedUrlRequest.Key,
                    Expires = getPreSignedUrlRequest.Expires,
                    Url = _s3Client.GetPreSignedURL(getPreSignedUrlRequest)
                };

                serviceResponse.Data = dto;
                serviceResponse.StatusCode = HttpStatusCode.OK;
                serviceResponse.Message = "Success";
            }
            catch (AmazonS3Exception e)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadGateway;
                serviceResponse.Message = e.Message;
                return serviceResponse;
            }


            return serviceResponse;
        }

        public async Task<DataServiceResponse<GetSignedUrlResponseDto>> AdminResearchPictureUploadUrlAsync(int researcherId)
        {
            Researcher? researcher = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == researcherId);

            string s3ObjectKey;

            if (researcher != null && researcher.ImageName != "")
                s3ObjectKey = researcher.ImageName;
            else
                s3ObjectKey = $"Pictures/Researchers/{GenerateS3ObjectKey()}";

            try
            {
                GetPreSignedUrlRequest getPreSignedUrlRequest = new()
                {
                    BucketName = _bucketName,
                    Key = s3ObjectKey,
                    ContentType = "image/*",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                GetSignedUrlResponseDto dto = new()
                {
                    BucketName = getPreSignedUrlRequest.BucketName,
                    Key = getPreSignedUrlRequest.Key,
                    Expires = getPreSignedUrlRequest.Expires,
                    Url = _s3Client.GetPreSignedURL(getPreSignedUrlRequest)
                };

                return new DataServiceResponse<GetSignedUrlResponseDto>
                {
                    Data = dto,
                    StatusCode = HttpStatusCode.OK,
                    Message = "Success"
                };
            }
            catch (AmazonS3Exception e)
            {
                return new DataServiceResponse<GetSignedUrlResponseDto>
                {
                    StatusCode = HttpStatusCode.BadGateway,
                    Message = e.Message
                };
            }
        }

        public async Task<DataServiceResponse<GetSignedUrlResponseDto>> GeneratePresignedPublicationUploadUrl(string? publicationKey)
        {
            DataServiceResponse<GetSignedUrlResponseDto> serviceResponse = new();

            Publication? publicationFromDb = publicationKey != null ? await _db.Publications.FirstOrDefaultAsync(p => p.PublicationKey == publicationKey) : null;

            string s3ObjectKey = "";

            if (publicationFromDb != null && publicationFromDb.PublicationKey != "")
                s3ObjectKey = publicationFromDb.PublicationKey;
            else
                s3ObjectKey = $"Publications/{GenerateS3ObjectKey()}";

            try
            {
                GetPreSignedUrlRequest getPreSignedUrlRequest = new()
                {
                    BucketName = _bucketName,
                    Key = s3ObjectKey,
                    ContentType = "application/pdf",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                GetSignedUrlResponseDto dto = new()
                {
                    BucketName = getPreSignedUrlRequest.BucketName,
                    Key = getPreSignedUrlRequest.Key,
                    Expires = getPreSignedUrlRequest.Expires,
                    Url = _s3Client.GetPreSignedURL(getPreSignedUrlRequest)
                };

                serviceResponse.Data = dto;
                serviceResponse.StatusCode = HttpStatusCode.OK;
                serviceResponse.Message = "Success";
            }
            catch (AmazonS3Exception e)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadGateway;
                serviceResponse.Message = e.Message;
                return serviceResponse;
            }

            return serviceResponse;

        }

        public async Task<DataServiceResponse<GetSignedUrlResponseDto>> GetPresignedTopicUploadUrlAsync(int detailsId, string? imageKey)
        {
            TopicDetails? topicDetails = detailsId != 0 ? await _db.TopicDetails.FirstOrDefaultAsync(td => td.TopicDetailsId == detailsId) : null;

            string s3ObjectKey = "";

            if (topicDetails != null && topicDetails.ImageKey != "")
                s3ObjectKey = topicDetails.ImageKey;
            else
                s3ObjectKey = $"Pictures/Topics/{GenerateS3ObjectKey()}";

            try
            {
                GetPreSignedUrlRequest getPreSignedUrlRequest = new()
                {
                    BucketName = _bucketName,
                    Key = s3ObjectKey,
                    ContentType = "image/*",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                GetSignedUrlResponseDto dto = new()
                {
                    BucketName = getPreSignedUrlRequest.BucketName,
                    Key = getPreSignedUrlRequest.Key,
                    Expires = getPreSignedUrlRequest.Expires,
                    Url = _s3Client.GetPreSignedURL(getPreSignedUrlRequest)
                };

                return new DataServiceResponse<GetSignedUrlResponseDto>
                {
                    Data = dto,
                    StatusCode = HttpStatusCode.OK,
                    Message = "Success"
                };
            }
            catch (AmazonS3Exception e)
            {
                return new DataServiceResponse<GetSignedUrlResponseDto>
                {
                    StatusCode = HttpStatusCode.BadGateway,
                    Message = e.Message
                };
            }
        }

        public async Task<ServiceResponse> DeletePublicationAsync(string publicationKey)
        {
            ServiceResponse serviceResponse = new();

            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = publicationKey
                };

                var response = await _s3Client.DeleteObjectAsync(deleteObjectRequest);

                if (response.HttpStatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    serviceResponse.StatusCode = HttpStatusCode.OK;
                    serviceResponse.Message = "PDF deleted";
                }
                else
                {
                    throw new AmazonS3Exception("File not deleted successfully");
                }

                Publication publication = await _db.Publications.FirstAsync(p => p.PublicationKey == publicationKey);
                publication.PublicationKey = "";
                publication.PublicationUrl = "";
                _db.Publications.Update(publication);
                bool isUpdateSuccessful = await _db.SaveChangesAsync() > 0;

                if (!isUpdateSuccessful)
                {
                    serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                    serviceResponse.Message = "An error occured remove the publication url or key from the database.";
                }
            }
            catch (AmazonS3Exception e)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadGateway;
                serviceResponse.Message = e.Message;
            }

            return serviceResponse;
        }

        public async Task<ServiceResponse> DeleteTopicPhotoAsync(string photoKey)
        {
            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = photoKey
                };
                var response = await _s3Client.DeleteObjectAsync(deleteObjectRequest);

                if (response.HttpStatusCode != System.Net.HttpStatusCode.NoContent)
                    throw new AmazonS3Exception("File not deleted successfully");


                TopicDetails topicDetails = await _db.TopicDetails.FirstAsync(td => td.ImageKey == photoKey);
                topicDetails.ImageKey = "";
                topicDetails.ImageUrl = "";
                _db.TopicDetails.Update(topicDetails);

                bool isUpdateSuccessful = await _db.SaveChangesAsync() > 0;

                if (!isUpdateSuccessful)
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "An error occured removing the photo from the database"
                    };

                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Photo deleted successfully"
                };
            }
            catch (AmazonS3Exception e)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = e.Message
                };
            }
        }

        private async Task<Researcher?> GetResearcherFromToken(string token)
        {

            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            var userClaim = jwt.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier);
            if (userClaim == null)
            {
                // Handle missing claim
                return null;
            }

            string userId = userClaim.Value;
            Researcher? researcherFromDb = await _db.Researchers.FirstOrDefaultAsync(r => r.UserId == userId);
            return researcherFromDb;
        }

        private string GenerateS3ObjectKey()
        {
            Random random = new();
            Byte[] bytes = new byte[16];

            random.NextBytes(bytes);

            var hexArray = Array.ConvertAll(bytes, x => x.ToString("X2"));

            return String.Concat(hexArray);
        }
    }
}
