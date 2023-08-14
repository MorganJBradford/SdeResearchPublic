using SdeResearchApi.Entities.Models;
namespace SdeResearchApi.Entities.Dtos.ResearcherDtos
{
    public class AdminDashboardResearchers
    {
        public List<Researcher> Researchers { get; set; } = new();
        public List<Researcher> AdminCreatedResearchers { get;set; } = new();
    }
}
