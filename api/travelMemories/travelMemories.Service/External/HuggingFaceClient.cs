using Microsoft.Extensions.Configuration;
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

        public HuggingFaceClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["HuggingFace:ApiKey"];
            _apiUrl = configuration["HuggingFace:ApiUrl"];

            if (string.IsNullOrEmpty(_apiKey) || string.IsNullOrEmpty(_apiUrl))
            {
                throw new ArgumentException("Hugging Face API configuration is missing");
            }

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<byte[]> GenerateImageAsync(string prompt, string style = null, string size = "512x512")
        {
            try
            {
                // שינוי הפרמטרים למבנה שמתאים למודלים של Stable Diffusion XL
                var requestData = new
                {
                    inputs = style != null ? $"{prompt} in {style} style" : prompt,
                    // מחיקת parameters שלא תואמים את המודל הנוכחי
                    // השאר רק את ה-input
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(requestData),
                    Encoding.UTF8,
                    "application/json"
                );

                // הוספת ניסיונות חוזרים במקרה של כישלון
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
                            // המודל מתחמם, חכה ונסה שוב
                            retryCount++;
                            if (retryCount <= maxRetries)
                            {
                                await Task.Delay(2000); // המתנה לפני ניסיון חוזר
                                continue;
                            }
                        }

                        // כל שגיאה אחרת, נקבל פרטים ונזרוק שגיאה
                        var errorContent = await response.Content.ReadAsStringAsync();
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
                Console.WriteLine($"Error in HuggingFaceClient.GenerateImageAsync: {ex.Message}");
                throw;
            }
        }
    }
}