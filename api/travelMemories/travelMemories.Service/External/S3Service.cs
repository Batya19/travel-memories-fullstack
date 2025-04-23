using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TravelMemories.Core.Interfaces.External;
using TravelMemories.Service.Helpers;

namespace TravelMemories.Service.External
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;

        public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client ?? throw new ArgumentNullException(nameof(s3Client));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folderName, string fileName = null)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file), "File cannot be null");
            }

            if (string.IsNullOrEmpty(folderName))
            {
                throw new ArgumentException("Folder name cannot be null or empty", nameof(folderName));
            }

            try
            {
                return await _s3Client.UploadFileAsync(_configuration, file, folderName, fileName);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error uploading file to S3: {ex.Message}", ex);
            }
        }

        public async Task<byte[]> DownloadFileAsync(string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            try
            {
                return await _s3Client.DownloadFileAsync(_configuration, fileKey);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error downloading file from S3: {ex.Message}", ex);
            }
        }

        public async Task DeleteFileAsync(string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            try
            {
                await _s3Client.DeleteFileAsync(_configuration, fileKey);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error deleting file from S3: {ex.Message}", ex);
            }
        }

        public string GetFileUrl(string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            try
            {
                return _configuration.GetFileUrl(fileKey);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error getting file URL from S3: {ex.Message}", ex);
            }
        }
    }
}