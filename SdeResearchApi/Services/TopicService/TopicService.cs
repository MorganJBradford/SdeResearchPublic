using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.TopicDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Entities.Data;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using SdeResearchApi.Entities.Dtos.Topic;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Amazon.S3.Model;
using Amazon.Runtime;
using Amazon.S3;
using SdeResearchApi.Services.SecretsService;

namespace SdeResearchApi.Services.TopicService
{
    public partial class TopicService : ITopicService
    {
        private readonly AmazonS3Client _s3Client;
        private readonly SdeResearchDbContext _db;
        private readonly UserManager<User> _userManager;
        private readonly ISecretsService _secretsService;
        private readonly string _bucketName;
        public TopicService(SdeResearchDbContext db, UserManager<User> userManager, ISecretsService secretsService)
        {
            _userManager = userManager;
            _db = db;
            _secretsService = secretsService;
            var appSettings = _secretsService.GetAppSettings();
            _bucketName = appSettings.BucketName;
            _s3Client = new AmazonS3Client();
        }


        public async Task<DataServiceResponse<AnyTopicsExistResponseDto>> AnyTopicsExistAsync()
        {
            var serviceResponse = new DataServiceResponse<AnyTopicsExistResponseDto>
            {
                Data = new AnyTopicsExistResponseDto
                {
                    AnyTopicsExist = false,
                    AcademicTopicsExist = false,
                }
            };

            try
            {
                bool anyTopicsExist = await _db.Topics.AnyAsync();
                bool anyAcademicTopics = await _db.Topics.Where(t => t.Type == "academic").AnyAsync();

                if (!anyTopicsExist)
                {
                    serviceResponse.StatusCode = HttpStatusCode.NotFound;
                    serviceResponse.Message = "No topics have been created";
                    return serviceResponse;
                }

                serviceResponse.Data.AnyTopicsExist = true;

                if (anyAcademicTopics)
                {
                    serviceResponse.Data.AcademicTopicsExist = true;
                }

                serviceResponse.StatusCode = HttpStatusCode.OK;
                serviceResponse.Message = "Success";

            }
            catch (Exception ex)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = ex.Message;
                return serviceResponse;
            }

            return serviceResponse;

        }

        public async Task<DataServiceResponse<List<TopicIdNameDto>>> GetNavTopicsAsync()
        {
            DataServiceResponse<List<TopicIdNameDto>> serviceResponse = new();
            List<TopicIdNameDto> navTopics = await _db.Topics.Where(t => t.IsTopicPagePublished == true && t.Type == "academic").OrderBy(topic => topic.TopicName).Select(t => new TopicIdNameDto
            {
                TopicId = t.TopicId,
                TopicName = t.TopicName,
            }).ToListAsync();

            if (!navTopics.Any())
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No topics available";
                return serviceResponse;
            }

            serviceResponse.Data = navTopics;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<DataServiceResponse<Topic>> GetTopicDetailsByIdAsync(int topicId)
        {
            DataServiceResponse<Topic> serviceResponse = new();
            Topic? topicToReturn = await _db.Topics.Include(topic => topic.Details)
                .ThenInclude(details => details.Sections
                .OrderBy(section => section.DisplayOrder))
                .Include(topic => topic.Details)
                .ThenInclude(details => details.Researcher)
                .FirstOrDefaultAsync(x => x.TopicId == topicId);


            if (topicToReturn == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }


            serviceResponse.Data = topicToReturn;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<DataServiceResponse<List<Topic>>> GetTopicsByType(string topicType)
        {
            DataServiceResponse<List<Topic>> serviceResponse = new();
            List<Topic> topicList = await _db.Topics.Where(t => t.Type == topicType).ToListAsync();

            if (!topicList.Any())
            {
                serviceResponse.StatusCode= HttpStatusCode.NotFound;
                serviceResponse.Message = $"No {topicType} topics available";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Data = topicList;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<ServiceResponse> CreateTopic(CreateTopicRequestDto request)
        {
            var serviceResponse = new ServiceResponse();
            Topic? academicTopicFromDb = await _db.Topics.Where(topic => topic.Type == "academic").FirstOrDefaultAsync(topic => topic.TopicName == request.TopicName);
            Topic? practitionerTopicFromDb = await _db.Topics.Where(topic => topic.Type == "practitioner").FirstOrDefaultAsync(topic => topic.TopicName == request.TopicName);

            if (request.Type == "academic" && academicTopicFromDb != null)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = "Duplicate academic topic name";
                return serviceResponse;
            }

            if (request.Type == "practitioner" && practitionerTopicFromDb != null)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = "Duplicate practitioner topic name";
                return serviceResponse;
            }

            Topic topicToCreate = new()
            {
                TopicName = request.TopicName,
                Type = request.Type
            };

            foreach (var categoryId in request.CategoryIds)
            {
                Category categoryFromDb = await _db.Categories.FirstAsync(c => c.CategoryId == categoryId);
                TopicCategory topicCategoryToAdd = new()
                {
                    Category = categoryFromDb,
                    Topic = topicToCreate
                };
                await _db.TopicCategories.AddAsync(topicCategoryToAdd);
            }



            await _db.Topics.AddAsync(topicToCreate);
            bool changeSuccessful = await _db.SaveChangesAsync() > 0;

            if (!changeSuccessful)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Topic created successful";

            return serviceResponse;
        }

        public async Task<ServiceResponse> UpdateTopicDetailsAsync(UpdateTopicDetailsRequestDto request, string token)
        {
            var serviceResponse = new ServiceResponse();
            Topic? topicFromDb = await _db.Topics.Include(t => t.Details).ThenInclude(d => d.Sections).FirstOrDefaultAsync(t => t.TopicId == request.TopicId);
            var (researcherFromToken, roles) = await GetResearcherFromToken(token);

            if (topicFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = "Please add a topic first";
                return serviceResponse;
            }

            if (researcherFromToken == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }


            if (topicFromDb.Details == null)
            {
                bool isTopicAdded = await AddDetailsToTopic(request, topicFromDb, researcherFromToken);
                if (!isTopicAdded)
                {
                    serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                    serviceResponse.Message = "An error has occurred adding topic details";
                    return serviceResponse;
                }

                serviceResponse.StatusCode = HttpStatusCode.Created;
                serviceResponse.Message = $"{topicFromDb.TopicId} added";
                return serviceResponse;
            }

            bool isUserAuthor = topicFromDb.Details.ResearcherId == researcherFromToken.ResearcherId;
            bool isUserAdmin = roles.Contains("Administrator");

            if (!isUserAdmin)
            {
                if (!isUserAuthor)
                {
                    serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                    serviceResponse.Message = "Unauthorized";
                    return serviceResponse;
                }
            }

            bool isTopicUpdated = await UpdateDetails(request, topicFromDb);

            if (!isTopicUpdated)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "As error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Edit successful";

            return serviceResponse;
        }

        private async Task<(Researcher? researcher, List<string> roles)> GetResearcherFromToken(string token)
        {


            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            var userClaim = jwt.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier);
   
            string userId = userClaim.Value;
            Researcher? researcherFromDb = await _db.Researchers.Include(researcher => researcher.User).FirstOrDefaultAsync(r => r.UserId == userId);

            List<string> userRoles = new();

            if (researcherFromDb?.User != null)
            {
                userRoles = (await _userManager.GetRolesAsync(researcherFromDb.User)).ToList();
            }

            return (researcherFromDb, userRoles);
        }

        private async Task<bool> AddDetailsToTopic(UpdateTopicDetailsRequestDto request, Topic topicFromDb, Researcher researcherFromToken)
        {
            TopicDetails topicDetails = new()
            {
                ResearcherId = researcherFromToken.ResearcherId,
                Researcher = researcherFromToken,
                TopicId = topicFromDb.TopicId,
                Topic = topicFromDb,
                ImageKey = request.ImageKey,
                ImageUrl = request.ImageUrl
            };

            foreach (var section in request.Sections)
            {
                TopicSection sectionToAdd = new()
                {
                    TopicDetails = topicDetails,
                    TopicDetailsId = topicDetails.TopicDetailsId,
                    SectionId = section.SectionId,
                    DisplayOrder = section.DisplayOrder,
                    SectionTitle = section.SectionTitle,
                    SectionBody = section.SectionBody,
                };
                await _db.TopicSections.AddAsync(sectionToAdd);
            }
            await _db.TopicDetails.AddAsync(topicDetails);
            return await _db.SaveChangesAsync() > 0;
        }

        private async Task<bool> UpdateDetails(UpdateTopicDetailsRequestDto request, Topic topicFromDb)
        {
            if (topicFromDb.Details == null || topicFromDb.Details.Sections == null)
            {
                return false;
            }

            foreach (var section in topicFromDb.Details.Sections)
            {
                if (!request.Sections.Contains(section))
                {
                    _db.TopicSections.Remove(section);
                }
            }

            foreach (var section in request.Sections)
            {
                TopicSection? sectionFromDb = await _db.TopicSections.FirstOrDefaultAsync(ts => ts.SectionId == section.SectionId);

                if (sectionFromDb != null)
                {

                    sectionFromDb.SectionTitle = section.SectionTitle;
                    sectionFromDb.SectionBody = section.SectionBody;
                    sectionFromDb.DisplayOrder = section.DisplayOrder;
                    _db.TopicSections.Update(sectionFromDb);
                }

                if (sectionFromDb == null)
                {
                    TopicSection sectionToAdd = new()
                    {
                        TopicDetailsId = topicFromDb.Details.TopicDetailsId,
                        TopicDetails = topicFromDb.Details,
                        SectionTitle = section.SectionTitle,
                        SectionBody = section.SectionBody,
                        DisplayOrder = section.DisplayOrder,
                    };

                    await _db.TopicSections.AddAsync(sectionToAdd);
                }

            }

            topicFromDb.Details.ImageUrl = request.ImageUrl;
            topicFromDb.Details.ImageKey = request.ImageKey;

            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<ServiceResponse> PublishTopicPage(PublishTopicPageRequestDto request, string token)
        {
            var serviceResponse = new ServiceResponse();
            Topic? topicFromDb = await _db.Topics.Include(topic => topic.Details)
                .ThenInclude(details => details.Researcher)
                .FirstOrDefaultAsync(t => t.TopicId == request.TopicId);

            var (researcherFromToken, roles) = await GetResearcherFromToken(token);

            if (researcherFromToken == null ||
                topicFromDb == null ||
                topicFromDb.Details == null
                )
            {
                serviceResponse.StatusCode = HttpStatusCode.Unauthorized;
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }

            topicFromDb.IsTopicPagePublished = request.IsTopicPagePublished;

            _db.Topics.Update(topicFromDb);
            bool isUpdated = await _db.SaveChangesAsync() > 0;

            if (!isUpdated)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occured";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = topicFromDb.IsTopicPagePublished == true ? "Successfully published" : "Page in now private";

            return serviceResponse;
        }

        public async Task<ServiceResponse> UpdateBaseTopic(UpdateBaseTopicRequestDto request, string authToken)
        {
            // Refactor to not remove a TopicCategory if it was still sent.
            var serviceResponse = new ServiceResponse();
            Topic? topicFromDb = await _db.Topics.Where(t => t.Type == request.Type).Include(topic => topic.Details).Include(t => t.TopicCategories).FirstOrDefaultAsync(t => t.TopicId == request.TopicId);
            Topic? duplicateTopic = await _db.Topics.Where(t => t.Type == request.Type).FirstOrDefaultAsync(t => t.TopicName == request.TopicName);

            if (topicFromDb == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = "Please select a valid topic";
                return serviceResponse;
            }

            if (duplicateTopic != null && duplicateTopic.TopicName != topicFromDb.TopicName)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = $"{request.Type} topic '{request.TopicName}' already exists";
                return serviceResponse;
            }

            if (topicFromDb.TopicCategories == null)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = $"No categories associated with {request.TopicName}";
                return serviceResponse;
            }

            List<Category> requestCategories = new();

            foreach (var categoryId in request.CategoryIds)
            {
                Category? categoryToAdd = await _db.Categories.FirstOrDefaultAsync(tc => tc.CategoryId == categoryId);

                if (categoryToAdd == null)
                {
                    serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                    serviceResponse.Message = "An error has occurred";
                    return serviceResponse;
                }

                requestCategories.Add(categoryToAdd);
            }

            foreach (var tc in topicFromDb.TopicCategories)
            {
                if (!requestCategories.Contains(tc.Category))
                {
                    _db.TopicCategories.Remove(tc);
                }
            }

            List<TopicCategory> newTcList = new();
            foreach (var category in requestCategories)
            {
                Category categoryFromDb = await _db.Categories.FirstAsync(c => c.CategoryId == category.CategoryId);
                TopicCategory topicCategoryToAdd = new()
                {
                    Category = categoryFromDb,
                    Topic = topicFromDb
                };
                newTcList.Add(topicCategoryToAdd);
                await _db.TopicCategories.AddAsync(topicCategoryToAdd);
            }

            topicFromDb.TopicName = request.TopicName;
            topicFromDb.Type = request.Type;
            topicFromDb.TopicCategories = newTcList;
            _db.Topics.Update(topicFromDb);

            bool isSaveSuccessful = await _db.SaveChangesAsync() > 0;

            if (!isSaveSuccessful)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error has occurred";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.Created;
            serviceResponse.Message = "Changed successfully";

            return serviceResponse;
        }

        public async Task<ServiceResponse> DeleteTopicById(int topicId, string authToken)
        {
            Topic? topicToDelete = await _db.Topics.Include(topic => topic.Details).FirstOrDefaultAsync(x => x.TopicId == topicId);
            var (researcherFromToken, roles) = await GetResearcherFromToken(authToken);

            if (topicToDelete == null || researcherFromToken == null)  
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };     

            if (topicToDelete.Details != null)
            {
                bool isUserAuthor = topicToDelete.Details.ResearcherId == researcherFromToken.ResearcherId;
                bool isUserAdmin = roles.Contains("Administrator");

                if (!isUserAdmin)
                {
                    if (!isUserAuthor)
                    {
                        return new ServiceResponse
                        {
                            StatusCode = HttpStatusCode.Unauthorized,
                            Message = "Unauthorized"
                        };
                    }
                }

                if (topicToDelete.Details.ImageKey != "")
                {
                    bool isPhotoDeleted = await DeletetTopicPicture(topicToDelete.Details.ImageKey);

                    if (!isPhotoDeleted)
                    {
                        return new ServiceResponse
                        {
                            StatusCode = HttpStatusCode.InternalServerError,
                            Message = "An error occurred deleting this topics photo. Please contact database admin"
                        };
                    }
                }
            }

            _db.Topics.Remove(topicToDelete);
            bool changeSuccessful = await _db.SaveChangesAsync() > 0;
            if (!changeSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error has occured"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Deleted successfuly"
            };
        }

        private async Task<bool> DeletetTopicPicture(string objectKey)
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

        public async Task<ServiceResponse> AssignAuthorAsync(AssignAuthorRequest request)
        {
            if (request.ResearcherId == 0)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Please select a valid author"
                };
            Topic? topic = await _db.Topics.Include(t => t.Details).FirstOrDefaultAsync(t => t.TopicId == request.TopicId);
            Researcher? researcher = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == request.ResearcherId);

            if (researcher == null)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Researcher not found"
                };

            if (topic == null)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Topic not found"
                };

            if (topic.Details == null)
            {
                topic.Details = new TopicDetails
                {
                    Researcher = researcher,
                    ResearcherId = researcher.ResearcherId,
                    Sections = new List<TopicSection> { new TopicSection() }
                };

                _db.Topics.Update(topic);
            } else
            {
                topic.Details.ResearcherId = request.TopicId;
                topic.Details.Researcher = researcher;
                _db.Topics.Update(topic);
            }

            bool isUpdateSuccessful = await _db.SaveChangesAsync() > 0;

            if (!isUpdateSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error occured saving the author"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.Created,
                Message = "Updated successfully"
            };
        }
    }
}