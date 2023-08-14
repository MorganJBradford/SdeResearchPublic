using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Entities.Dtos.Auth;

namespace SdeResearchApi.Services.AuthService
{
    public interface IAuthService
    {
        Task<ServiceResponse> RegisterUserAsync(UserRegisterRequestDto request);
        Task<DataServiceResponse<LoginOrRefresh>> UserLoginAsync(UserLoginRequestDto request);
        Task<DataServiceResponse<LoginOrRefresh>> RefreshTokenAsync(string refreshtoken, string authToken);
        Task<ServiceResponse> UserLogoutAsync(string token);
        Task<ServiceResponse> ResetPasswordAsync(ResetPasswordRequestDto request);
    }
}
