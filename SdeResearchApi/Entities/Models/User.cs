using Microsoft.AspNetCore.Identity;

namespace SdeResearchApi.Entities.Models
{
    public class User : IdentityUser
    {
        public string? TempPassword { get; set; }
        public virtual RefreshToken? RefreshToken { get; set; }
        public virtual Researcher? Researcher { get; set; }
    }
}
