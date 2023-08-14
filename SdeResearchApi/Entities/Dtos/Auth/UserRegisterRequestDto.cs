namespace SdeResearchApi.Entities.Dtos.Auth
{
    public class UserRegisterRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
