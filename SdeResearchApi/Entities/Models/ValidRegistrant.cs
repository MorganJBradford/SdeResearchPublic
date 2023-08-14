using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SdeResearchApi.Entities.Models
{
    public class ValidRegistrant
    {
        [Key]
        public int RegistrantId { get; set; }
        public string RegistrantEmail { get; set; } = string.Empty;
        [ForeignKey("Researcher")]
        public int? ResearcherId { get; set; }
    }
}
