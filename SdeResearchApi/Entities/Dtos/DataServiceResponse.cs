using System.Net;

namespace SdeResearchApi.Entities.Dtos
{
    public class DataServiceResponse<T>
    {
        public T? Data { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
