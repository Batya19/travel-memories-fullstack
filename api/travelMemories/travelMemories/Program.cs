using Amazon;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TravelMemories;
using TravelMemories.Data.Context;
using TravelMemories.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddUserSecrets<Program>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(3),
            errorCodesToAdd: null)));

builder.Services.AddAWSService<IAmazonS3>(new AWSOptions
{
    Credentials = new BasicAWSCredentials(
        builder.Configuration["AWS:S3:AccessKey"],
        builder.Configuration["AWS:S3:SecretKey"]),
    Region = RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
});

builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.RegisterServices();
builder.Services.RegisterRepositories();
builder.Services.RegisterExternalServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });

    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("https://travel-memories-react.onrender.com")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("https://travel-memories-angular.onrender.com")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Travel Memories API",
        Version = "v1",
        Description = "API for Travel Memories application",
        Contact = new OpenApiContact
        {
            Name = "Development Team",
            Email = "dev@travelmemories.com"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.UseSwagger(c =>
    {
        c.RouteTemplate = "swagger/{documentName}/swagger.json";
    });

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Travel Memories API V1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
        c.EnableFilter();
    });

    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var migrationLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            migrationLogger.LogInformation("Attempting to apply migrations...");
            dbContext.Database.Migrate();
            migrationLogger.LogInformation("Migrations applied successfully.");
        }
        catch (Exception ex)
        {
            var errorLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            errorLogger.LogError(ex, "An error occurred while applying migrations.");
        }
    }
}
else
{
    app.UseMiddleware<ExceptionMiddleware>();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseMiddleware<JwtMiddleware>();
app.UseAuthorization();

app.MapControllers();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application started successfully. Swagger should be available at /swagger");

app.Run();