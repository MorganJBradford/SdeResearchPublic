using Microsoft.AspNetCore.Authentication.Cookies;

namespace SdeResearchApi.Services
{
    public class NullCookieManager : ICookieManager
    {
        public void AppendResponseCookie(HttpContext context, string cookie, string? something, CookieOptions options)
        {
        }

        public void DeleteCookie(HttpContext context, string cookie, CookieOptions options)
        {
        }

        public string GetRequestCookie(HttpContext context, string key)
        {
            return "";
        }
    }
}
