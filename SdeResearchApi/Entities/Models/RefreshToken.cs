using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SdeResearchApi.Entities.Models
{
    public class RefreshToken
    {
        [Key]
        public int RefreshTokenId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;
        [Timestamp]
        public byte[] RowVersion { get; set; } = new byte[0];
    }
}
