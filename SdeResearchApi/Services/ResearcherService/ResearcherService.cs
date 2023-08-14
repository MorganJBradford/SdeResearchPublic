using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.ResearcherDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.SecretsService;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace SdeResearchApi.Services.ResearcherService
{
    public class ResearcherService : IResearcherService
    {
        private readonly AmazonS3Client _s3Client;
        private readonly SdeResearchDbContext _db;
        private readonly ISecretsService _secretsService;
        private readonly string _bucketName;
        public ResearcherService(SdeResearchDbContext db, ISecretsService secretsService)
        {
            _db = db;
            _secretsService = secretsService;
            var appSettings = _secretsService.GetAppSettings();
            _bucketName = appSettings.BucketName;
            _s3Client = new AmazonS3Client();
        }

        public async Task<DataServiceResponse<GetResearcherByAuthResponseDto<Researcher>>> GetResearcherByIdAsync(int researcherId)
        {
            DataServiceResponse<GetResearcherByAuthResponseDto<Researcher>> serviceResponse = new();
            GetResearcherByAuthResponseDto<Researcher> getResearcherByAuthDto = new();

            Researcher? researcherFromToken = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == researcherId);

            if (researcherFromToken == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }

            getResearcherByAuthDto.Researcher = researcherFromToken;

            if (researcherFromToken.ProfilePicture != null)
                getResearcherByAuthDto.ProfilePicture = researcherFromToken.ProfilePicture;

            serviceResponse.Data = getResearcherByAuthDto;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";


            return serviceResponse;
        }

        public async Task<DataServiceResponse<List<ResearcherIdName>>> GetResearchersIdsNamesAsync()
        {
            List<ResearcherIdName>? researchers = await _db.Researchers.Where(r => r.FirstName != "" && r.LastName != "").Select(r => new ResearcherIdName
            {
                ResearcherId = r.ResearcherId,
                ResearcherName = $"{r.FirstName} {r.LastName}"
            }).ToListAsync();

            if (researchers == null)
                return new DataServiceResponse<List<ResearcherIdName>>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "No researchers available"
                };

            return new DataServiceResponse<List<ResearcherIdName>>
            {
                Data = researchers,
                StatusCode = HttpStatusCode.OK,
                Message = "Success"
            };
        }

        public async Task<DataServiceResponse<Researcher>> UpdateResearcher(CreateOrUpdateResearcherRequestDto request, string authToken)
        {
            DataServiceResponse<Researcher> serviceResponse = new();
            Researcher? researcherFromDb = await GetResearcherFromToken(authToken);

            if (researcherFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }

            researcherFromDb.FirstName = request.FirstName;
            researcherFromDb.LastName = request.LastName;
            researcherFromDb.Institution = request.Institution;
            researcherFromDb.Department = request.Department ?? "";
            researcherFromDb.Biography = request.Biography;
            researcherFromDb.ProfilePicture = request.ImageUrl ?? "";
            researcherFromDb.ImageName = request.ImageKey ?? "";

            _db.Researchers.Update(researcherFromDb);

            bool isResearcherUpdated = await _db.SaveChangesAsync() > 0;

            if (!isResearcherUpdated)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.Data = researcherFromDb;
            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Successfully updated";

            return serviceResponse;
        }

        public async Task<ServiceResponse> AdminCreateResearcherAsync(CreateOrUpdateResearcherRequestDto request)
        {
            Researcher researcher = new()
            {
                ResearcherId = 0,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Institution = request.Institution,
                Department = request.Department ?? "",
                Biography = request.Biography,
                ProfilePicture = request.ImageUrl ?? "",
                ImageName = request.ImageKey ?? ""
            };

            await _db.Researchers.AddAsync(researcher);
            bool isCreationSuccessful = await _db.SaveChangesAsync() > 0;

            if (!isCreationSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error occurred creating the researcher"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.Created,
                Message = "Researcher created"
            };
        }

        public async Task<ServiceResponse> AdminUpdateResearcherAsync(CreateOrUpdateResearcherRequestDto request)
        {
            Researcher? researcherFromDb = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == request.ResearcherId);

            if (researcherFromDb == null)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Please select a valid researcher to edit"
                };

            researcherFromDb.FirstName = request.FirstName;
            researcherFromDb.LastName = request.LastName;
            researcherFromDb.Institution = request.Institution;
            researcherFromDb.Department = request.Department ?? "";
            researcherFromDb.Biography = request.Biography;
            researcherFromDb.ProfilePicture = request.ImageUrl ?? "";
            researcherFromDb.ImageName = request.ImageKey ?? "";

            _db.Researchers.Update(researcherFromDb);
            bool isUpdateSuccessful = await _db.SaveChangesAsync() > 0;

            if (!isUpdateSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error occured saving changes"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.Created,
                Message = "Change made successfully"
            };
        }

        public async Task<ServiceResponse> AdminDeleteResearcherAsync(int researcherId)
        {
            try
            {
                Researcher researcher = await _db.Researchers.Include(r => r.User).FirstAsync(r => r.ResearcherId == researcherId);

                if (researcher.User != null)
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "A user is associated with this researcher"
                    };

                if (researcher.ImageName != "")
                {
                    bool isPictureDeleted = await DeleteResearcherPicture(researcher.ImageName);

                    if (!isPictureDeleted)
                        return new ServiceResponse
                        {
                            StatusCode = HttpStatusCode.BadGateway,
                            Message = "An error occured deleting the researcher's picture. Please contact database admin"
                        };
                }

                _db.Researchers.Remove(researcher);

                ValidRegistrant? registrant = await _db.ValidRegistrants.FirstOrDefaultAsync(vr => vr.ResearcherId == researcherId);

                if (registrant != null)
                    _db.ValidRegistrants.Remove(registrant);

                bool areChangesSuccessful = await _db.SaveChangesAsync() > 0;

                if (!areChangesSuccessful)
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "An error occurred. Please contact database admin"
                    };

                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "OK"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = ex.Message
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

        public async Task<DataServiceResponse<List<Researcher>>> GetApprovedResearchers()
        {
            DataServiceResponse<List<Researcher>> serviceResponse = new();
            List<Researcher> researchersFromDb = await _db.Researchers.Where(researcher => researcher.HasAdminApprovedProfile == true).ToListAsync();

            if (researchersFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.Data = researchersFromDb;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<DataServiceResponse<AdminDashboardResearchers>> GetAdminDashboardResearchersAsync()
        {
            var adminDashboardDto = new AdminDashboardResearchers
            {
                Researchers = await _db.Researchers.Where(g => g.UserId != null).ToListAsync(),
                AdminCreatedResearchers = await _db.Researchers.Where(u => u.UserId == null).ToListAsync()
            };

            HttpStatusCode statusCode = HttpStatusCode.OK;
            string message = "Success";

            if (!adminDashboardDto.Researchers.Any() && !adminDashboardDto.AdminCreatedResearchers.Any())
            {
                statusCode = HttpStatusCode.NotFound;
                message = "No researchers found";
            }

            return new DataServiceResponse<AdminDashboardResearchers>
            {
                Data = adminDashboardDto,
                StatusCode = statusCode,
                Message = message

            };
        }

        public async Task<ServiceResponse> ApproveResearcherProfile(int researcherId)
        {
            var serviceResponse = new ServiceResponse();
            Researcher? researcherFromDb = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == researcherId);

            if (researcherFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "Researcher not found";
                return serviceResponse;
            }

            researcherFromDb.HasAdminApprovedProfile = !researcherFromDb.HasAdminApprovedProfile;
            _db.Researchers.Update(researcherFromDb);

            bool isResearcherUpdated = await _db.SaveChangesAsync() > 0;

            if (!isResearcherUpdated)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            string approvalStatusMessage = researcherFromDb.HasAdminApprovedProfile ? "approved" : "hidden";
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = $"{researcherFromDb.FirstName} {researcherFromDb.LastName} has been {approvalStatusMessage}";
            return serviceResponse;
        }

        private async Task<bool> DeleteResearcherPicture(string objectKey)
        {

            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = objectKey
            };

            var response = await _s3Client.DeleteObjectAsync(deleteObjectRequest);

            if (response.HttpStatusCode != HttpStatusCode.NoContent)
            return false;

            return true;
        }
    }
}
