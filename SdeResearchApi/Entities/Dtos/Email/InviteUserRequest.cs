namespace SdeResearchApi.Entities.Dtos.Email
{
    public class InviteUserRequest
    {
        public int ResearcherId { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}
