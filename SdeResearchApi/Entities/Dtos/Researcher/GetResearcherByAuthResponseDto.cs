namespace SdeResearchApi.Entities.Dtos.ResearcherDtos
{
    public class GetResearcherByAuthResponseDto<T>
    {
        public T? Researcher { get; set; }
        public string ProfilePicture { get; set; } = string.Empty;
    }
}
