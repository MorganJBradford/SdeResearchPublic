namespace SdeResearchApi.Entities.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string Email { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
        public string ResearcherName { get; set; } = string.Empty;
        public int ResearcherId { get; set; }
        public bool IsAdmin { get; set; }
    }
}
