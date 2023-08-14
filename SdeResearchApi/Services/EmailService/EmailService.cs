using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Email;
using SdeResearchApi.Entities.Models;
using System.Net;
using System.Security.Cryptography;

namespace SdeResearchApi.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IAmazonSimpleEmailService _sesClient;
        private readonly UserManager<User> _userManager;
        private readonly SdeResearchDbContext _db;
        private readonly string _sourceEmail;

        public EmailService(UserManager<User> userManager, SdeResearchDbContext db, IConfiguration configuration)
        {
            _sesClient = new AmazonSimpleEmailServiceClient();
            _userManager = userManager;
            _db = db;
            _sourceEmail = configuration["Email:SourceEmail"];
        }
     
        public async Task<ServiceResponse> SendGetInvolvedEmailAsync(string name, string replyTo, string subject, string body)
        {
            ServiceResponse serviceResponse = new();
            var formattedBody = $"Name: {name}\n\nEmail: {replyTo}\n\n\n\nMessage:\n{body}\n\n\n\n**Click 'Reply' to reply directly to the listed email**";
            var sendRequest = new SendEmailRequest
            {
                Source = _sourceEmail,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { _sourceEmail },
                },
                Message = new Message
                {
                    Subject = new Content(subject),
                    Body = new Body
                    {
                        Text = new Content(formattedBody),
                    }
                },
                ReplyToAddresses = new List<string> { replyTo }
            };

            try
            {
                await _sesClient.SendEmailAsync(sendRequest);
            }
            catch (Exception ex)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadGateway;
                serviceResponse.Message = "An error occurred sending the email";
                serviceResponse.Message += $"; {ex.Message}";
                return serviceResponse;
            }
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Sent successfully.";
            return serviceResponse;
        }

        public async Task<ServiceResponse> SendAuthorEmailAsync(string name, string replyTo, string recipient, string subject, string body)
        {
            ServiceResponse serviceResponse = new();
            var formattedBody = $"Name: {name}\n\nEmail: {replyTo}\n\n\n\nMessage:\n{body}\n\n\n\n**Click 'Reply' to reply directly to the listed email**";
            var sendRequest = new SendEmailRequest
            {
                Source = _sourceEmail,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { recipient },
                },
                Message = new Message
                {
                    Subject = new Content(subject),
                    Body = new Body
                    {
                        Text = new Content(formattedBody)
                    }
                },
                ReplyToAddresses = new List<string> { replyTo }
            };

            try
            {
                await _sesClient.SendEmailAsync(sendRequest);
            }
            catch (Exception ex)
            {
                serviceResponse.StatusCode = HttpStatusCode.BadGateway;
                serviceResponse.Message = "An error occurred sending the email";
                serviceResponse.Message += $"; {ex.Message}";
                return serviceResponse;
            }
            serviceResponse.StatusCode = HttpStatusCode.OK;
            serviceResponse.Message = "Sent successfully.";
            return serviceResponse;
        }

        public async Task<ServiceResponse> InviteUserAsync(InviteUserRequest request)
        {
            int? researcherId = null;
            string message = $"Invite successful. {request.Email} can be used to create an account once they've verified their email";
            string errorMessage = $"An error occurred adding {request.Email} to the list of valid registrants. Please contact database admin.";

            if (request.ResearcherId != 0)
                researcherId = await _db.Researchers
                    .Where(r => r.ResearcherId == request.ResearcherId)
                    .Select(r => r.ResearcherId)
                    .FirstOrDefaultAsync();

            try
            {
                var verifyRequest = new VerifyEmailAddressRequest
                {
                    EmailAddress = request.Email
                };

                await _sesClient.VerifyEmailAddressAsync(verifyRequest);

                bool isRegistrantAdded = false;

                if (researcherId != null)
                {
                    ValidRegistrant? registrantFromDb = await _db.ValidRegistrants
                        .FirstOrDefaultAsync(vr => vr.ResearcherId == researcherId);

                    if (registrantFromDb == null)
                    {
                        _db.ValidRegistrants.Add(new ValidRegistrant
                        {
                            RegistrantEmail = request.Email,
                            ResearcherId = researcherId
                        });
                        isRegistrantAdded = await _db.SaveChangesAsync() > 0;
                        if (!isRegistrantAdded)
                            message = errorMessage;
                    }
                    else
                    {
                        registrantFromDb.RegistrantEmail = request.Email;
                        _db.ValidRegistrants.Update(registrantFromDb);
                        isRegistrantAdded = await _db.SaveChangesAsync() > 0;
                        if (!isRegistrantAdded)
                            message = errorMessage;
                    }

                    
                }
                else
                {
                    _db.ValidRegistrants.Add(new ValidRegistrant
                    {
                        RegistrantEmail = request.Email
                    });
                    isRegistrantAdded = await _db.SaveChangesAsync() > 0;
                    if (!isRegistrantAdded)
                        message = errorMessage;
                }


                if (!isRegistrantAdded)
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = message
                    };

                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = message
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadGateway,
                    Message = ex.Message
                };
            }

        }

        public async Task<ServiceResponse> GetResetPasswordEmailAsync(string email)
        {
            User? user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };
            }

            string randomPassword = GenerateRandomPassword(12);

            string hashedPassword = _userManager.PasswordHasher.HashPassword(null, randomPassword);
            user.TempPassword = hashedPassword;

            _db.Users.Update(user);

            bool isChangeSuccessful = await _db.SaveChangesAsync() > 0;


             if (!isChangeSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error has occurred"
                };

            var sendRequest = new SendEmailRequest
            {
                Source = _sourceEmail,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { email },
                },
                Message = new Message
                {
                    Subject = new Content("Reset Password"),
                    Body = new Body
                    {
                        Text = new Content($"Your new password is: {randomPassword}")
                    }
                }
            };

            try
            {
                await _sesClient.SendEmailAsync(sendRequest);
            }
            catch (Exception ex)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadGateway,
                    Message = $"An error occurred sending your reset email; {ex.Message}",
                };
            }

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Please check your email for your new password"
            };
        }


        private string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            using (var rng = RandomNumberGenerator.Create())
            {
                var bytes = new byte[length];
                rng.GetBytes(bytes);
                var chars = bytes.Select(b => validChars[b % validChars.Length]);
                return new string(chars.ToArray());
            }
        }
    }
}
