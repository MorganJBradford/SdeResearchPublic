using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.ResearcherDtos;
using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Services.ResearcherService
{
    public interface IResearcherService
    {
        Task<ServiceResponse> ApproveResearcherProfile(int researcherId);
        Task<DataServiceResponse<AdminDashboardResearchers>> GetAdminDashboardResearchersAsync();
        Task<DataServiceResponse<List<ResearcherIdName>>> GetResearchersIdsNamesAsync();
        Task<DataServiceResponse<List<Researcher>>> GetApprovedResearchers();
        Task<DataServiceResponse<GetResearcherByAuthResponseDto<Researcher>>> GetResearcherByIdAsync(int researcherId);
        Task<DataServiceResponse<Researcher>> UpdateResearcher(CreateOrUpdateResearcherRequestDto request, string authToken);
        Task<ServiceResponse> AdminCreateResearcherAsync(CreateOrUpdateResearcherRequestDto request);
        Task<ServiceResponse> AdminUpdateResearcherAsync(CreateOrUpdateResearcherRequestDto request);
        Task<ServiceResponse> AdminDeleteResearcherAsync(int researcherId);
    }
}