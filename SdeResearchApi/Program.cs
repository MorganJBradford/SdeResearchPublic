using Amazon.SecretsManager;
using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Data;
using SdeResearchApi.Entities.Models;
using SdeResearchApi.Services.AuthService;
using SdeResearchApi.Services.ConfigureSecretsService;
using SdeResearchApi.Services.EmailService;
using SdeResearchApi.Services.NewsService;
using SdeResearchApi.Services.PublicationService;
using SdeResearchApi.Services.ResearcherService;
using SdeResearchApi.Services.MediaService;
using SdeResearchApi.Services.SecretsService;
using SdeResearchApi.Services.TopicCategoryService;
using SdeResearchApi.Services.TopicService;
using System.Text.Json.Serialization;
using SdeResearchApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<IAmazonSecretsManager, AmazonSecretsManagerClient>();
builder.Services.AddSingleton<ISecretsService, SecretsService>();
builder.Services.AddHostedService<ConfigureSecretsService>();
builder.Services.AddSingleton<IAmazonSimpleEmailService, AmazonSimpleEmailServiceClient>();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.AddHostedService<PostConfigureJwtBearerOptions>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy", builder =>
    {
        builder
        .WithMethods("POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD")
        .WithHeaders("Content-Type", "Accept")
        .WithOrigins("https://sderesearch.org/", "https://sdereaserch.org") // Make sure the origins are correctly spelled
        .AllowCredentials();
    });
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Update the DbContext registration
builder.Services.AddDbContext<SdeResearchDbContext>((serviceProvider, options) =>
{
    var secretsService = serviceProvider.GetRequiredService<ISecretsService>();
    var connectionString = secretsService.GetAppSettings().DbConnection;
    options.UseNpgsql(connectionString);
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.CookieManager = new NullCookieManager();
});

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<SdeResearchDbContext>()
    .AddDefaultTokenProviders()
    .AddTokenProvider<DataProtectorTokenProvider<User>>(TokenOptions.DefaultProvider);

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<IPublicationService, PublicationService>();
builder.Services.AddScoped<IResearcherService, ResearcherService>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<ITopicCategoryService, TopicCategoryService>();

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("CORSPolicy");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();