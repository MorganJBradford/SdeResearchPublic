using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SdeResearchApi.Services.SecretsService;
using System.Text;

public class PostConfigureJwtBearerOptions : IHostedService
{
    private readonly IOptionsMonitor<JwtBearerOptions> _options;
    private readonly ISecretsService _secretsService;
    private readonly IConfiguration _configuration;

    public PostConfigureJwtBearerOptions(
        IOptionsMonitor<JwtBearerOptions> options,
        ISecretsService secretsService,
        IConfiguration configuration)
    {
        _options = options;
        _secretsService = secretsService;
        _configuration = configuration;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var appSettings = _secretsService.GetAppSettings();
        var tokenSecret = appSettings.Token;

        var options = _options.Get(JwtBearerDefaults.AuthenticationScheme);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = _configuration.GetSection("AppSettings:Issuer").Value!,
            ValidAudience = _configuration.GetSection("AppSettings:Audience").Value!,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSecret)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromSeconds(15)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["sdeAuthToken"];
                return Task.CompletedTask;
            }
        };
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}