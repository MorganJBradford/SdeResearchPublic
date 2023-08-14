namespace SdeResearchApi.Entities.Dtos.Auth
{
    public class LoginOrRefresh
    {
        public AuthResponseDto AuthResponse { get; set; } = new();
        public string AuthToken { get; set; } = string.Empty;
        public string RefreshToken { get; set;} = string.Empty;
    }
}
