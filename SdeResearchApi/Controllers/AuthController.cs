using Microsoft.AspNetCore.Mvc;
using SdeResearchApi.Entities.Dtos.Auth;
using SdeResearchApi.Entities.Dtos;
using SdeResearchApi.Services.AuthService;
using SdeResearchApi.Entities.Data;
using System.Net;
using Microsoft.AspNetCore.DataProtection;

namespace SdeResearchApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SdeResearchDbContext _db;
        private readonly IAuthService _authService;

        public AuthController(SdeResearchDbContext db, IAuthService authService)
        {
            _db = db;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse>> RegisterAsync(UserRegisterRequestDto request)
        {
            ServiceResponse serviceResponse = await _authService.RegisterUserAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);

        }

        [HttpPost("login")]
        public async Task<ActionResult<DataServiceResponse<AuthResponseDto>>> LoginAsync(UserLoginRequestDto request)
        {
            DataServiceResponse<LoginOrRefresh> serviceResponse = await _authService.UserLoginAsync(request);

            if (serviceResponse.StatusCode == System.Net.HttpStatusCode.OK && serviceResponse.Data != null)
            {
                // Check if authToken and refreshToken are not empty
                if (!string.IsNullOrEmpty(serviceResponse.Data.AuthToken) && !string.IsNullOrEmpty(serviceResponse.Data.RefreshToken))
                {
                    Response.Cookies.Append("sdeAuthToken", serviceResponse.Data.AuthToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        Expires = DateTime.UtcNow.AddMinutes(60),
                        SameSite = SameSiteMode.None,
                    });

                    Response.Cookies.Append("sdeRefreshToken", serviceResponse.Data.RefreshToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        Expires= DateTime.UtcNow.AddDays(7),
                        SameSite = SameSiteMode.None,
                    });

                    return StatusCode((int)serviceResponse.StatusCode, new DataServiceResponse<AuthResponseDto>
                    {
                        StatusCode = serviceResponse.StatusCode,
                        Message = serviceResponse.Message,
                        Data = serviceResponse.Data.AuthResponse
                    });
                }
            }

            return StatusCode((int)serviceResponse.StatusCode, new DataServiceResponse<AuthResponseDto>
            {
                StatusCode = serviceResponse.StatusCode,
                Message = serviceResponse.Message
            });
        }



        [HttpPost("logout")]
        public async Task<ActionResult<ServiceResponse>> UserLogoutAsync()
        {
            if (!Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            ServiceResponse serviceResponse = await _authService.UserLogoutAsync(token!);
            
            if (serviceResponse.StatusCode == HttpStatusCode.OK)
            {
                Response.Cookies.Delete("sdeAuthToken");
                Response.Cookies.Delete("sdeRefreshToken");
            }

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<DataServiceResponse<AuthResponseDto>>> RefreshTokenAsync()
        {
            if (!Request.Cookies.TryGetValue("sdeRefreshToken", out string? refreshToken) ||
                    !Request.Cookies.TryGetValue("sdeAuthToken", out string? token))
            {
                return Unauthorized();
            }

            var serviceResponse = await _authService.RefreshTokenAsync(refreshToken!, token!);

            if (serviceResponse.StatusCode != HttpStatusCode.OK || serviceResponse.Data == null)
            {
                return StatusCode((int)serviceResponse.StatusCode, new DataServiceResponse<AuthResponseDto>() { StatusCode = serviceResponse.StatusCode, Message = serviceResponse.Message });
            }
            var authCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(60),
                SameSite = SameSiteMode.None
            };

            var refreshCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None
            };
            Response.Cookies.Append("sdeAuthToken", serviceResponse.Data.AuthToken, authCookieOptions);
            Response.Cookies.Append("sdeRefreshToken", serviceResponse.Data.RefreshToken, refreshCookieOptions);

            return StatusCode((int)serviceResponse.StatusCode, new DataServiceResponse<AuthResponseDto>() { StatusCode = serviceResponse.StatusCode, Message = serviceResponse.Message, Data = serviceResponse.Data.AuthResponse });
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ServiceResponse>> ResetPasswordAsync([FromBody] ResetPasswordRequestDto request)
        {
            ServiceResponse serviceResponse = await _authService.ResetPasswordAsync(request);

            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }

    }
}
