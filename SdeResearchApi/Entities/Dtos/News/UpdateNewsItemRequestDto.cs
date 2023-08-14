namespace SdeResearchApi.Entities.Dtos.NewsDtos
{
    public class UpdateNewsItemRequestDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
