namespace SdeResearchApi.Entities.Dtos.ResearcherDtos
{
    public class CreateOrUpdateResearcherRequestDto
    {
        public int? ResearcherId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string? Department { get; set; } = string.Empty;
        public string Biography { get; set; } = string.Empty;
        public string? ImageUrl { get; set;} = string.Empty;
        public string? ImageKey { get; set;} = string.Empty;
    }
}
