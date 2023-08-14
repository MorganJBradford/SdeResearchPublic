using System.Net;

namespace SdeResearchApi.Entities.Dtos
{
    public class ServiceResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
