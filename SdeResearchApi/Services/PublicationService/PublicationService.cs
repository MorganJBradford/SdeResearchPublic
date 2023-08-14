using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos.PublicationDtos;
using SdeResearchApi.Entities.Dtos;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Models;
using System.Net;
using Amazon.SimpleEmail.Model;
using Amazon.SimpleEmail;

namespace SdeResearchApi.Services.PublicationService
{
    public class PublicationService : IPublicationService
    {
        private readonly IAmazonSimpleEmailService _sesClient;
        private readonly SdeResearchDbContext _db;
        private readonly string _defaultEmail;

        public PublicationService(IAmazonSimpleEmailService sesClient, SdeResearchDbContext db, IConfiguration configuration)
        {
            _sesClient = sesClient;
            _db = db;
            _defaultEmail = configuration["Email:SourceEmail"];
        }

        public async Task<DataServiceResponse<GetPublicationsSortedByTypeResponseDto>> GetPublicationsSortedByTypeAsync()
        {
            DataServiceResponse<GetPublicationsSortedByTypeResponseDto> serviceResponse = new();
            GetPublicationsSortedByTypeResponseDto responseDto = new();
            List<AdminPublication> academicPublications = await _db.Publications
                .Where(p => p.Type == "academic")
                .Include(p => p.PublicationTopicCategories)
                .ThenInclude(ptc => ptc.TopicCategory)
                .Select(p => new AdminPublication
                {
                    PublicationId = p.PublicationId,
                    Citation = p.Citation,
                    LinkToSource = p.LinkToSource,
                    PublicationKey = p.PublicationKey,
                    PublicationUrl = p.PublicationUrl,
                    ContactEmail = p.ContactEmail,
                    IsPublished = p.IsPublished,
                    Type = p.Type,
                    TopicIds = p.PublicationTopicCategories.Select(ptc => ptc.TopicCategory.TopicId).Distinct().ToList(),
                    TopicCategoryIds = p.PublicationTopicCategories.Select(ptc => ptc.TopicCategory.TopicCategoryId).Distinct().ToList()
                })
                .ToListAsync();

            List<AdminPublication> practitionerPublications = await _db.Publications
                .Where(p => p.Type == "practitioner")
                .Include(p => p.PublicationTopicCategories)
                    .ThenInclude(ptc => ptc.TopicCategory)
                .Select(p => new AdminPublication
                {
                    PublicationId = p.PublicationId,
                    Citation = p.Citation,
                    LinkToSource = p.LinkToSource,
                    PublicationKey = p.PublicationKey,
                    PublicationUrl = p.PublicationUrl,
                    ContactEmail = p.ContactEmail,
                    Type = p.Type,
                    TopicIds = p.PublicationTopicCategories.Select(ptc => ptc.TopicCategory.TopicId).Distinct().ToList(),
                    TopicCategoryIds = p.PublicationTopicCategories.Select(ptc => ptc.TopicCategory.TopicCategoryId).Distinct().ToList()
                })
                .ToListAsync();



            if (!academicPublications.Any() && !practitionerPublications.Any())
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No publications found";
                return serviceResponse;
            }

            if (academicPublications.Any())
                responseDto.AcademicPublications = academicPublications;

            if (practitionerPublications.Any())
                responseDto.PractitionerPublications = practitionerPublications;

            serviceResponse.Data = responseDto;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";

            return serviceResponse;
        }

        public async Task<DataServiceResponse<List<Publication>>> GetPublicationsByCategoryAndTopicIdsAsync(int categoryId, int topicId)
        {
            DataServiceResponse<List<Publication>> serviceResponse = new();

            var topicCategoryId = await _db.TopicCategories
                .Where(tc => tc.CategoryId == categoryId && tc.TopicId == topicId)
                .Select(tc => tc.TopicCategoryId)
                .FirstOrDefaultAsync();

            if (topicCategoryId == 0)
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No topic category found for the given category id and topic id";
                return serviceResponse;
            }

            List<Publication> publications = await _db.PublicationTopicCategories
                .Where(ptc => ptc.TopicCategoryId == topicCategoryId && ptc.Publication.IsPublished == true)
                .Select(ptc => ptc.Publication)
                .ToListAsync();

            if (!publications.Any())
            {
                serviceResponse.StatusCode = HttpStatusCode.NotFound;
                serviceResponse.Message = "No publications found for the given category id and topic id";
                return serviceResponse;
            }

            serviceResponse.Data = publications;
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<ServiceResponse> CreatePublicationAsync(CreatePublicationRequestDto request)
        {
            List<TopicCategory> topicCategories = new();
            List<int> sortedTopicCategoryIds = request.TopicCategoryIds.OrderBy(id => id).ToList();
            bool isEmailNull = string.IsNullOrEmpty(request.ContactEmail);

            var verificationStatus = !isEmailNull ? await IsEmailVerifiedAsync(request.ContactEmail) : null;

            if (!isEmailNull && verificationStatus != VerificationStatus.Success)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = $"{request.ContactEmail} is not approved. Please select a vaild email or leave blank to use admin email"
                };
            

            Publication publicationToCreate = new()
            {
                PublicationUrl = request.PublicationUrl,
                Citation = request.Citation,
                LinkToSource = request.LinkToSource,
                PublicationKey = request.PublicationKey,
                ContactEmail = isEmailNull ? _defaultEmail : request.ContactEmail,
                Type = request.Type,
            };

            foreach (var tcId in sortedTopicCategoryIds)
            {
                TopicCategory topicCategory = await _db.TopicCategories.FirstAsync(tcdb => tcdb.TopicCategoryId == tcId);
                PublicationTopicCategory publicationTopicCategory = new()
                {
                    TopicCategory = topicCategory,
                    Publication = publicationToCreate,
                };
                
                await _db.PublicationTopicCategories.AddAsync(publicationTopicCategory);
            }

            bool saveSuccessful = await _db.SaveChangesAsync() > 0;

            if (!saveSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error has occured"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.Created,
                Message = "Success"
            };
        }


        public async Task<ServiceResponse> UpdatePublicationAsync(UpdatePublicationRequestDto request)
        {

            var publicationFromDb = await _db.Publications
                .Include(p => p.PublicationTopicCategories)
                .FirstOrDefaultAsync(p => p.PublicationId == request.PublicationId);

            if (publicationFromDb == null)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Publication not found"
                };

            bool isEmailNull = string.IsNullOrEmpty(request.ContactEmail);

            var verificationStatus = !isEmailNull ? await IsEmailVerifiedAsync(request.ContactEmail) : null;

            if (!isEmailNull && verificationStatus != VerificationStatus.Success)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = $"{request.ContactEmail} is not approved. Select a vaild email, contact admin, or leave blank to use admin email"
                };

            publicationFromDb.PublicationUrl = request.PublicationUrl;
            publicationFromDb.PublicationKey = request.PublicationKey;
            publicationFromDb.LinkToSource = request.LinkToSource;
            publicationFromDb.Citation = request.Citation;
            publicationFromDb.Type = request.Type;
            publicationFromDb.ContactEmail = isEmailNull ? _defaultEmail : request.ContactEmail;

            try
            {
                // Identify the PublicationTopicCategory to remove
                var toRemove = publicationFromDb.PublicationTopicCategories
                    .Where(tc => !request.TopicCategoryIds.Contains(tc.TopicCategoryId))
                    .ToList();

                _db.PublicationTopicCategories.RemoveRange(toRemove);

                // Identify the TopicCategoryIds to add
                var existingTopicCategoryIds = publicationFromDb.PublicationTopicCategories
                    .Select(tc => tc.TopicCategoryId);

                var toAdd = request.TopicCategoryIds.Except(existingTopicCategoryIds);

                foreach (var tcId in toAdd)
                {
                    var topicCategoryFromDb = await _db.TopicCategories.FirstOrDefaultAsync(tc => tc.TopicCategoryId == tcId);
                    if (topicCategoryFromDb == null)
                        return new ServiceResponse
                        {
                            StatusCode = HttpStatusCode.NotFound,
                            Message = $"TopicCategory with ID {tcId} not found"
                        };

                    var publicationTopicCategoryToAdd = new PublicationTopicCategory
                    {
                        PublicationId = publicationFromDb.PublicationId,
                        TopicCategoryId = topicCategoryFromDb.TopicCategoryId
                    };
                    await _db.PublicationTopicCategories.AddAsync(publicationTopicCategoryToAdd);
                }

                var isUpdateSuccessful = await _db.SaveChangesAsync() > 0;

                if (!isUpdateSuccessful)
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "Update failed. Please make a change to the publication"
                    };

                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Created,
                    Message = "Update successful"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = $"An error occurred while updating the publication: {ex.Message}"
                };
            }
        }

        private async Task<VerificationStatus> IsEmailVerifiedAsync(string email)
        {
            var verificationAttributesResponse = await _sesClient.GetIdentityVerificationAttributesAsync(new GetIdentityVerificationAttributesRequest
            {
                Identities = { email }
            });

            if (verificationAttributesResponse.VerificationAttributes.TryGetValue(email, out var verificationAttributes))
            {
                return verificationAttributes.VerificationStatus;
            }
            return VerificationStatus.Failed;
        }

        public async Task<ServiceResponse> DeletePublicationAsync(int publicationId)
        {
            var serviceResponse = new ServiceResponse();

            Publication publication = await _db.Publications.FirstAsync(p => p.PublicationId == publicationId);

            _db.Publications.Remove(publication);

            bool isDeleted = await _db.SaveChangesAsync() > 0;

            if (!isDeleted)
            {
                serviceResponse.StatusCode= HttpStatusCode.InternalServerError;
                serviceResponse.Message = "An error occured removed the publication from the database";
                return serviceResponse;
            }

            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Success";
            return serviceResponse;
        }

        public async Task<ServiceResponse> PublishPublicationAsync(int publicationId)
        {
            var serviceResponse = new ServiceResponse();
            Publication publication = await _db.Publications.FirstAsync(p => p.PublicationId == publicationId);

            publication.IsPublished = !publication.IsPublished;

            _db.Publications.Update(publication);

            bool isUpdated = await _db.SaveChangesAsync() > 0;

            if (!isUpdated)
            {
                serviceResponse.StatusCode = HttpStatusCode.InternalServerError;
                string failedMessage = publication.IsPublished == true ? "publishing" : "hiding";
                serviceResponse.Message = $"An error occured {failedMessage} the publication.";
                return serviceResponse;
            }
            string successMessage = publication.IsPublished == true ? "Published" : "Hiden";
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = successMessage;
            return serviceResponse;
        }
    }
}