using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using TravelMemories;
using TravelMemories.Core.DTOs.Auth;
using TravelMemories.Core.Interfaces.External;
using TravelMemories.Data.Context;
using Amazon.S3;
using Xunit;

namespace TravelMemories.Tests.Controllers
{
    public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AuthControllerTests(WebApplicationFactory<Program> factory)
        {
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
            
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.UseSetting("ASPNETCORE_ENVIRONMENT", "Testing");
                
                builder.ConfigureAppConfiguration((context, config) =>
                {
                    config.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        { "ConnectionStrings:DefaultConnection", "" },
                        { "JwtSettings:SecretKey", "TestSecretKeyThatIsAtLeast32CharactersLong!" },
                        { "JwtSettings:Issuer", "TravelMemories" },
                        { "JwtSettings:Audience", "TravelMemoriesUsers" },
                        { "JwtSettings:ExpiryMinutes", "1440" },
                        { "AWS:S3:BucketName", "test-bucket" },
                        { "AWS:Region", "us-east-1" },
                        { "AWS:S3:AccessKey", "test-key" },
                        { "AWS:S3:SecretKey", "test-secret" },
                        { "HuggingFace:BaseUrl", "https://api-inference.huggingface.co" },
                        { "HuggingFace:ApiUrl", "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0" }
                    });
                });

                builder.ConfigureServices(services =>
                {
                    var descriptorsToRemove = services.Where(
                        d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                             d.ServiceType == typeof(ApplicationDbContext) ||
                             (d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)) ||
                             (d.ImplementationType != null && d.ImplementationType == typeof(ApplicationDbContext))).ToList();
                    
                    foreach (var descriptor in descriptorsToRemove)
                    {
                        services.Remove(descriptor);
                    }

                    var amazonS3Descriptors = services.Where(
                        d => d.ServiceType == typeof(Amazon.S3.IAmazonS3)).ToList();
                    foreach (var descriptor in amazonS3Descriptors)
                    {
                        services.Remove(descriptor);
                    }

                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid().ToString());
                    });

                    var s3ServiceDescriptors = services.Where(
                        d => d.ServiceType == typeof(IS3Service)).ToList();
                    foreach (var descriptor in s3ServiceDescriptors)
                    {
                        services.Remove(descriptor);
                    }

                    var huggingFaceDescriptors = services.Where(
                        d => d.ServiceType == typeof(IHuggingFaceClient)).ToList();
                    foreach (var descriptor in huggingFaceDescriptors)
                    {
                        services.Remove(descriptor);
                    }

                    var mockS3Service = new Mock<IS3Service>();
                    services.AddSingleton(mockS3Service.Object);

                    var mockHuggingFaceClient = new Mock<IHuggingFaceClient>();
                    services.AddSingleton(mockHuggingFaceClient.Object);
                });

            });
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Register_ShouldReturnOk_WhenValidRequest()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                Email = "test@example.com",
                Password = "Test123!@#",
                FirstName = "Test",
                LastName = "User"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register", registerDto);

            // Assert
            if (response.StatusCode != HttpStatusCode.OK)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Expected OK but got {response.StatusCode}. Response: {errorContent}");
            }
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            result.Should().NotBeNull();
            result!.Token.Should().NotBeNullOrEmpty();
            result.Email.Should().Be(registerDto.Email);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenEmailExists()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                Email = "existing@example.com",
                Password = "Test123!@#",
                FirstName = "Test",
                LastName = "User"
            };

            // Register first time
            var firstResponse = await _client.PostAsJsonAsync("/api/auth/register", registerDto);
            firstResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            // Act - Try to register again with same email
            var response = await _client.PostAsJsonAsync("/api/auth/register", registerDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenValidCredentials()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                Email = "login@example.com",
                Password = "Test123!@#",
                FirstName = "Test",
                LastName = "User"
            };

            var loginDto = new LoginDto
            {
                Email = "login@example.com",
                Password = "Test123!@#"
            };

            // Register first
            await _client.PostAsJsonAsync("/api/auth/register", registerDto);

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", loginDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            result.Should().NotBeNull();
            result!.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenInvalidCredentials()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "nonexistent@example.com",
                Password = "WrongPassword"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", loginDto);

            // Assert
            if (response.StatusCode != HttpStatusCode.Unauthorized && response.StatusCode != HttpStatusCode.BadRequest)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Expected Unauthorized or BadRequest but got {response.StatusCode}. Response: {errorContent}");
            }
            response.StatusCode.Should().BeOneOf(HttpStatusCode.Unauthorized, HttpStatusCode.BadRequest);
        }
    }
}

