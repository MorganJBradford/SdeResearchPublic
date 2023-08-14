using System.ComponentModel.DataAnnotations.Schema;

namespace SdeResearchApi.Entities.Models
{
    public class Researcher
    {
        public int ResearcherId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Biography { get; set; } = string.Empty;
        public string ImageName { get; set; } = string.Empty;
        public bool HasAdminApprovedProfile { get; set; } = false;
        public string ProfilePicture { get; set; } = string.Empty;
        public string? UserId { get; set; } = null;
        public virtual User? User { get; set; }
        public virtual List<TopicDetails>? TopicDetails { get; set; }
    }
}
