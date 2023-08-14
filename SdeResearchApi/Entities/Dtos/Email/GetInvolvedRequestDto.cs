namespace SdeResearchApi.Entities.Dtos.Email
{
    public class GetInvolvedRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string ReplyTo { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
