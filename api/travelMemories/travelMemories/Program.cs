using Amazon;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using SixLabors.ImageSharp;
using System;
using System.IO;
using System.Reflection;
using TravelMemories;
using TravelMemories.Data.Context;
using TravelMemories.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Load user secrets
builder.Configuration.AddUserSecrets<Program>();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container
builder.Services.AddControllers();

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(3),
            errorCodesToAdd: null)));

// ����� ������ AWS S3 - ����
builder.Services.AddAWSService<IAmazonS3>(new AWSOptions
{
    Credentials = new BasicAWSCredentials(
        builder.Configuration["AWS:S3:AccessKey"],  // ����� �-AWS:AccessKey �-AWS:S3:AccessKey
        builder.Configuration["AWS:S3:SecretKey"]), // ����� �-AWS:SecretKey �-AWS:S3:SecretKey
    Region = RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
});

// Add authentication and authorization
builder.Services.AddJwtAuthentication(builder.Configuration);

// Register services and repositories
builder.Services.RegisterServices();
builder.Services.RegisterRepositories();
builder.Services.RegisterExternalServices(builder.Configuration);

// Configure CORS
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
        builder.WithOrigins("http://localhost:5173") // Your React app URL
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Add Swagger/OpenAPI with more detailed configuration
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

    // Add JWT Authentication to Swagger
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

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Configure Swagger UI
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

    // Apply migrations in development environment
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
    // Use exception handler middleware in production
    app.UseMiddleware<ExceptionMiddleware>();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Add this if you have static files

app.UseRouting();

// Use CORS middleware
app.UseCors("AllowAllOrigins");

// ��� �� ����: Authentication, Middleware, Authorization
app.UseAuthentication();
// Move JwtMiddleware after UseAuthentication but before UseAuthorization
app.UseMiddleware<JwtMiddleware>();
app.UseAuthorization();

app.MapControllers();

// Log application started
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application started successfully. Swagger should be available at /swagger");

app.Run();