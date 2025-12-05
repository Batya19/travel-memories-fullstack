using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;
using TravelMemories.Core.Interfaces.External;

namespace TravelMemories.Service.External
{
    public class HuggingFaceClient : IHuggingFaceClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiUrl;
        private readonly ILogger<HuggingFaceClient> _logger;

        public HuggingFaceClient(HttpClient httpClient, IConfiguration configuration, ILogger<HuggingFaceClient> logger)
        {
            _httpClient = httpClient;
            _apiKey = configuration["HuggingFace:ApiKey"];
            _apiUrl = configuration["HuggingFace:ApiUrl"];
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger.LogError("HuggingFace API key is missing in configuration");
                throw new ArgumentException("Hugging Face API key is not configured. Please set HuggingFace:ApiKey in configuration.");
            }

            if (string.IsNullOrEmpty(_apiUrl))
            {
                _logger.LogError("HuggingFace API URL is missing in configuration");
                throw new ArgumentException("Hugging Face API URL is not configured. Please set HuggingFace:ApiUrl in configuration.");
            }

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<byte[]> GenerateImageAsync(string prompt, string style = null, string size = "512x512")
        {
            try
            {
                var requestData = new
                {
                    inputs = style != null ? $"{prompt} in {style} style" : prompt
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(requestData),
                    Encoding.UTF8,
                    "application/json"
                );

                int maxRetries = 2;
                int retryCount = 0;
                HttpResponseMessage response = null;

                while (retryCount <= maxRetries)
                {
                    try
                    {
                        response = await _httpClient.PostAsync(_apiUrl, content);

                        if (response.IsSuccessStatusCode)
                        {
                            break;
                        }
                        else if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
                        {
                            retryCount++;
                            if (retryCount <= maxRetries)
                            {
                                await Task.Delay(2000);
                                continue;
                            }
                        }

                        var errorContent = await response.Content.ReadAsStringAsync();
                        _logger.LogError("HuggingFace API error: Status {StatusCode}, Details: {ErrorContent}", response.StatusCode, errorContent);
                        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                        {
                            throw new HttpRequestException($"Hugging Face API authentication failed. Please check your API key configuration. Status: {response.StatusCode}");
                        }
                        
                        throw new HttpRequestException($"Hugging Face API request failed: {response.StatusCode}. Details: {errorContent}");
                    }
                    catch (HttpRequestException)
                    {
                        retryCount++;
                        if (retryCount <= maxRetries)
                        {
                            await Task.Delay(2000);
                            continue;
                        }
                        throw;
                    }
                }

                if (response == null || !response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException("Failed to get successful response from Hugging Face API");
                }

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in HuggingFaceClient.GenerateImageAsync");
                throw;
            }
        }
    }
}