using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Email;

namespace SdeResearchApi.Services.EmailService
{
    public interface IEmailService
    {
        Task<ServiceResponse> SendGetInvolvedEmailAsync(string name, string replyTo, string subject, string body);
        Task<ServiceResponse> SendAuthorEmailAsync(string name, string replyTo, string recipient, string subject, string body);
        Task<ServiceResponse> GetResetPasswordEmailAsync(string email);
        Task<ServiceResponse> InviteUserAsync(InviteUserRequest request);
    }
}
