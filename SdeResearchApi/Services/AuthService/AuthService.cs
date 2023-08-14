using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Auth;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.SecretsService;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace SdeResearchApi.Services.AuthService
{
    public partial class AuthService : IAuthService
    {
        private readonly IAmazonSimpleEmailService _sesClient;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly SdeResearchDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly ISecretsService _secretsService;
        private readonly string _adminEmail;
        public AuthService
        (
            IAmazonSimpleEmailService sesClient,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            SdeResearchDbContext db,
            ISecretsService secretsService,
            IConfiguration configuration
        )
        {
            _sesClient = sesClient;
            _userManager = userManager;
            _signInManager = signInManager;
            _db = db;
            _secretsService = secretsService;
            _configuration = configuration;
            _adminEmail = _configuration["Email:SourceEmail"];
        }

        public async Task<ServiceResponse> RegisterUserAsync(UserRegisterRequestDto request)
        {
            var verificationStatus = await IsEmailVerifiedAsync(request.Email);
            if (verificationStatus == VerificationStatus.Pending)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = $"Email verification pending. If you cannot find the verification email please contact: {_adminEmail}"
                };
            }

            if (verificationStatus != VerificationStatus.Success)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };

            var validRegistrant = await GetValidRegistrantAsync(request.Email);
            if (validRegistrant == null)
            {
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };
            }

            var researcher = await GetResearcherByIdOrNewAsync(validRegistrant.ResearcherId ?? null);

            User userToAdd = new()
            {
                Email = request.Email,
                UserName = request.Email,
                Researcher = researcher
            };

            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                _db.ValidRegistrants.Remove(validRegistrant);
                bool isRemovalSuccessful = await _db.SaveChangesAsync() > 0;
                if (!isRemovalSuccessful)
                {
                    await transaction.RollbackAsync();
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "An error occurred removing this email from valid registrants. Please contact database admin"
                    };
                }

                var result = await _userManager.CreateAsync(userToAdd, request.Password).ConfigureAwait(false);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync().ConfigureAwait(false);
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "An error occurred with registering your account"
                    };
                }

                var addToRoleResult = await _userManager.AddToRoleAsync(userToAdd, "User").ConfigureAwait(false);
                if (!addToRoleResult.Succeeded)
                {
                    // Remove user if role assignment failed
                    var deletionResult = await _userManager.DeleteAsync(userToAdd).ConfigureAwait(false);
                    if (!deletionResult.Succeeded)
                    {
                        return new ServiceResponse
                        {
                            StatusCode = HttpStatusCode.InternalServerError,
                            Message = "An error occurred deleting your account"
                        };
                    }

                    await transaction.RollbackAsync().ConfigureAwait(false);
                    return new ServiceResponse
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "An error occurred while assigning role. Please contact admin."
                    };
                }

                await transaction.CommitAsync();

                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Created,
                    Message = "Registered successfully!"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync().ConfigureAwait(false);
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = $"An error occurred while registering your account: {ex}. Please try again later."
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

        private async Task<ValidRegistrant?> GetValidRegistrantAsync(string email)
        {
            return await _db.ValidRegistrants.FirstOrDefaultAsync(vr => vr.RegistrantEmail == email);
        }

        private async Task<Researcher> GetResearcherByIdOrNewAsync(int? researcherId)
        {
            if (researcherId == null)
                return new Researcher();

            var researcher = await _db.Researchers.FirstOrDefaultAsync(r => r.ResearcherId == researcherId);
            return researcher ?? new Researcher();
        }


        public async Task<DataServiceResponse<LoginOrRefresh>> UserLoginAsync(UserLoginRequestDto request)
        {
            try
            {
                var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, isPersistent: false, lockoutOnFailure: false);

                if (!result.Succeeded)
                {
                    return new DataServiceResponse<LoginOrRefresh>
                    {
                        StatusCode = HttpStatusCode.Unauthorized,
                        Message = "Unauthorized"
                    };
                }

                User? userFromDb = await _userManager.FindByEmailAsync(request.Email);
                if (userFromDb == null)
                {
                    return new DataServiceResponse<LoginOrRefresh>
                    {
                        StatusCode = HttpStatusCode.Unauthorized,
                        Message = "Unauthorized"
                    };
                }

                Researcher? researcherFromDb = await _db.Researchers.FirstOrDefaultAsync(r => r.UserId == userFromDb.Id);

                var authToken = await CreateAuthToken(userFromDb);

                RefreshToken newRefreshToken = GenerateRefreshToken();
                bool isrefreshtokensaved = await SaveRefreshTokenAsync(userFromDb, newRefreshToken);

                if (!isrefreshtokensaved)
                {
                    return new DataServiceResponse<LoginOrRefresh>
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "an error has occurred"
                    };
                }

                LoginOrRefresh loginServiceRepsonse = new()
                {
                    AuthResponse = new AuthResponseDto
                    {

                        Email = request.Email,
                        IsAdmin = await _userManager.IsInRoleAsync(userFromDb, "Administrator")
                    }
                };

                if (researcherFromDb != null)
                {
                    loginServiceRepsonse.AuthResponse.ResearcherId = researcherFromDb.ResearcherId;
                    loginServiceRepsonse.AuthResponse.ResearcherName = $"{researcherFromDb.FirstName} {researcherFromDb.LastName}";
                    if (researcherFromDb.ProfilePicture != null)
                        loginServiceRepsonse.AuthResponse.ProfilePicture = researcherFromDb.ProfilePicture;
                }

                loginServiceRepsonse.AuthToken = authToken;
                loginServiceRepsonse.RefreshToken = newRefreshToken.Token;

                return new DataServiceResponse<LoginOrRefresh>
                {
                    Data = loginServiceRepsonse,
                    StatusCode = HttpStatusCode.OK,
                    Message = "Success"
                };
            }
            catch (Exception ex)
            {
                var message = $"An error occurred: {ex.Message}";
                if (ex.InnerException != null)
                {
                    message = $"Inner exception: {ex.InnerException.Message}";
                }
                return new DataServiceResponse<LoginOrRefresh>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = message
                };
            }
        }

        public async Task<ServiceResponse> UserLogoutAsync(string authToken)
        {
            var serviceResponse = new ServiceResponse();
            try
            {
                // Read JWT and extract user id claim.
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(authToken);
                var userIdClaim = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier);
                var userId = userIdClaim.Value;

                // Get the user from the database.
                var user = await _userManager.FindByIdAsync(userId);

                // Delete the user's refresh token from the database.
                var refreshToken = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.UserId == user.Id);
                if (refreshToken != null)
                {
                    _db.RefreshTokens.Remove(refreshToken);
                    await _db.SaveChangesAsync();
                }

                serviceResponse.StatusCode = HttpStatusCode.OK;
                serviceResponse.Message = "Logged out successfully";
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                serviceResponse.StatusCode = HttpStatusCode.BadRequest;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        private async Task<bool> SaveRefreshTokenAsync(User user, RefreshToken newRefreshToken)
        {
            try
            {
                // Get the current refresh token from the database.
                var currentRefreshToken = await _db.RefreshTokens
                    .SingleOrDefaultAsync(rt => rt.UserId == user.Id);

                // If the current refresh token exists, update it.
                if (currentRefreshToken != null)
                {
                    currentRefreshToken.Token = newRefreshToken.Token;
                    currentRefreshToken.Expires = newRefreshToken.Expires;
                    currentRefreshToken.Created = newRefreshToken.Created;
                }
                else
                {
                    // If the current refresh token does not exist, add a new one.
                    newRefreshToken.UserId = user.Id;
                    await _db.RefreshTokens.AddAsync(newRefreshToken);
                }

                // Save changes to the database and return whether any changes were made.
                var changes = await _db.SaveChangesAsync();
                return changes > 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return false;
            }
        }



        public async Task<string> CreateAuthToken(User user)
        {
            var appSettings = _secretsService.GetAppSettings();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.Token));
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                var roleClaim = new Claim(ClaimTypes.Role, role);
                claims.Add(roleClaim);
            }

            SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha512Signature);

            JwtSecurityToken token = new(
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    audience: _configuration.GetSection("AppSettings:Audience").Value!,
                    issuer: _configuration.GetSection("AppSettings:Issuer").Value!,
                    signingCredentials: creds
                );

            string jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public async Task<DataServiceResponse<LoginOrRefresh>> RefreshTokenAsync(string refreshToken, string authToken)
        {
            const string UnauthorizedMsg = "Unauthorized";
            const string TimedOutMsg = "You have been timed out";
            try
            {
                string userId = new JwtSecurityTokenHandler().ReadJwtToken(authToken).Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

                User? userFromAuthToken = await _db.Users.Include(u => u.Researcher).FirstOrDefaultAsync(u => u.Id == userId);
                RefreshToken? refreshTokenFromDb = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken);


                if (userFromAuthToken == null || refreshTokenFromDb == null || userFromAuthToken.Id != refreshTokenFromDb.UserId)
                    return new DataServiceResponse<LoginOrRefresh> { StatusCode = HttpStatusCode.Unauthorized, Message = UnauthorizedMsg };

                if (refreshTokenFromDb.Expires < DateTime.UtcNow)
                    return new DataServiceResponse<LoginOrRefresh> { StatusCode = HttpStatusCode.Unauthorized, Message = TimedOutMsg };

                var token = await CreateAuthToken(userFromAuthToken);
                RefreshToken newRefreshToken = GenerateRefreshToken();
                bool isRefreshTokenSaved = await SaveRefreshTokenAsync(userFromAuthToken, newRefreshToken);

                if (!isRefreshTokenSaved)
                    return new DataServiceResponse<LoginOrRefresh>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "Error saving refresh token"
                    };

                LoginOrRefresh refreshServiceResponse = new()
                {
                    AuthResponse = new AuthResponseDto
                    {
                        Email = userFromAuthToken.Email,
                        IsAdmin = await _userManager.IsInRoleAsync(userFromAuthToken, "Administrator"),
                    },
                    AuthToken = token,
                    RefreshToken = newRefreshToken.Token
                };

                if (userFromAuthToken.Researcher != null)
                {
                    refreshServiceResponse.AuthResponse.ResearcherId = userFromAuthToken.Researcher.ResearcherId;
                    refreshServiceResponse.AuthResponse.ResearcherName = $"{userFromAuthToken.Researcher.FirstName} {userFromAuthToken.Researcher.LastName}";
                    if (userFromAuthToken.Researcher.ProfilePicture != "")
                        refreshServiceResponse.AuthResponse.ProfilePicture = userFromAuthToken.Researcher.ProfilePicture;
                }

                return new DataServiceResponse<LoginOrRefresh>
                {
                    Data = refreshServiceResponse,
                    StatusCode = HttpStatusCode.OK,
                    Message = "Successfuly refresh"
                };

            }
            catch (Exception ex)
            {
                var message = $"An error occurred: {ex.Message}";
                if (ex.InnerException != null)
                    message += $"Inner exception: {ex.InnerException.Message}";

                return new DataServiceResponse<LoginOrRefresh>{ StatusCode = HttpStatusCode.InternalServerError, Message = message };
            }
        }

        public async Task<ServiceResponse> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            User? user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || user.TempPassword == null)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };

            var verifactionResult = _userManager.PasswordHasher.VerifyHashedPassword(null, user.TempPassword, request.OldPassword);

            if (verifactionResult != PasswordVerificationResult.Success)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Message = "Unauthorized"
                };

            string hashedNewPassword = _userManager.PasswordHasher.HashPassword(null, request.NewPassword);
            user.PasswordHash = hashedNewPassword;
            user.TempPassword = null;

            _db.Users.Update(user);

            bool isChangeSuccessful = await _db.SaveChangesAsync() > 0;

            if (!isChangeSuccessful)
                return new ServiceResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "An error has occurred"
                };

            return new ServiceResponse
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Password changed successfully"
            };
        }

        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken()
            {
                Token = Guid.NewGuid().ToString(),
            };

            return refreshToken;
        }
    }
}
