using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.ResearcherDtos;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.ResearcherService;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ResearcherController : ControllerBase
    {
        private readonly IResearcherService _researcherService;
        public ResearcherController(IResearcherService researcherService)
        {
            _researcherService = researcherService;
        }

        [HttpGet("get-approved-researchers")]
        public async Task<ActionResult<DataServiceResponse<List<Researcher>>>> GetApprovedResearchersAsync()
        {
            DataServiceResponse<List<Researcher>> serviceResponse = await _researcherService.GetApprovedResearchers();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("admin-dashboard-researchers"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<DataServiceResponse<AdminDashboardResearchers>>> GetAdminDashboardResearchersAsync()
        {
            DataServiceResponse<AdminDashboardResearchers> serviceResponse = await _researcherService.GetAdminDashboardResearchersAsync();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("all-ids-names"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<DataServiceResponse<List<ResearcherIdName>>>> GetResearchersIdsNamesAsync()
        {
            DataServiceResponse<List<ResearcherIdName>> serviceResponse = await _researcherService.GetResearchersIdsNamesAsync();

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpGet("get-researcher-by-id/{researcherId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<DataServiceResponse<GetResearcherByAuthResponseDto<Researcher>>>> GetResearcherByAuthAsync(int researcherId)
        {
            DataServiceResponse<GetResearcherByAuthResponseDto<Researcher>> serviceResponse = await _researcherService.GetResearcherByIdAsync(researcherId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("update-researcher")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<DataServiceResponse<Researcher>>> UpdateResearcherAsync([FromForm] CreateOrUpdateResearcherRequestDto request)
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            DataServiceResponse<Researcher> serviceResponse = await _researcherService.UpdateResearcher(request, token!);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("approve-researcher-profile-by-id/{researcherId}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> ApproveResearcherProfile(int researcherId)
        {
            ServiceResponse serviceResponse = await _researcherService.ApproveResearcherProfile(researcherId);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("admin-create-researcher"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> AdminCreateResearcherAsync([FromBody] CreateOrUpdateResearcherRequestDto request)
        {
            ServiceResponse serviceResponse = await _researcherService.AdminCreateResearcherAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPut("admin-update-researcher"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> AdminUpdateResearcherAsync([FromBody] CreateOrUpdateResearcherRequestDto request)
        {
            ServiceResponse serviceResponse = await _researcherService.AdminUpdateResearcherAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpDelete("admin-delete-researcher/{researcherId}"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> AdminDeleteResearcherAsync(int researcherId)
        {
            ServiceResponse serviceResponse = await _researcherService.AdminDeleteResearcherAsync(researcherId);

            return StatusCode((int) serviceResponse.StatusCode, serviceResponse);
        }
    }
}