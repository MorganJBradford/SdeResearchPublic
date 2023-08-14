using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Email;
using SdeResearchApi.Services.EmailService;
using System.Net;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("get-involved")]
        public async Task<ActionResult<ServiceResponse>> SendGetInvolvedEmailAsync([FromBody] GetInvolvedRequestDto request)
        {
            ServiceResponse serviceResponse = await _emailService.SendGetInvolvedEmailAsync(request.Name, request.ReplyTo, request.Subject, request.Body);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("contact-author")]
        public async Task<ActionResult<ServiceResponse>> SendEmailAsync([FromBody] ContactAuthorRequestDto request)
        {
            ServiceResponse serviceResponse = await _emailService.SendAuthorEmailAsync(request.Name, request.ReplyTo, request.Recipient, request.Subject, request.Body);
            
            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ServiceResponse>> GetResetPasswordEmailAsync([FromQuery(Name = "email")] string email)
        {
            ServiceResponse serviceResponse = await _emailService.GetResetPasswordEmailAsync(email);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("invite-user"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Administrator")]
        public async Task<ActionResult<ServiceResponse>> InviteUserAsync([FromBody] InviteUserRequest request)
        {
            ServiceResponse serviceResponse = await _emailService.InviteUserAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
