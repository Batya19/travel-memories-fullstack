using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace TravelMemories.Service.Helpers
{
    public static class S3Helper
    {
        public static async Task<string> UploadFileAsync(
            this IAmazonS3 s3Client,
            IConfiguration configuration,
            IFormFile file,
            string folderName,
            string fileName = null)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file), "File cannot be null");
            }

            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration), "Configuration cannot be null");
            }

            var bucketName = configuration["AWS:S3:BucketName"];
            var accessKey = configuration["AWS:S3:AccessKey"];
            var secretKey = configuration["AWS:S3:SecretKey"];
            var region = configuration["AWS:Region"] ?? "us-east-1";

            if (string.IsNullOrEmpty(bucketName))
            {
                throw new ArgumentException("S3 bucket name is not configured");
            }

            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentException("AWS credentials are not configured");
            }

            // Create client with explicit credentials
            var s3ClientWithCredentials = new AmazonS3Client(
                accessKey,
                secretKey,
                RegionEndpoint.GetBySystemName(region)
            );

            try
            {
                // Generate a unique file name if not provided
                if (string.IsNullOrEmpty(fileName))
                {
                    var fileExtension = Path.GetExtension(file.FileName);
                    fileName = $"{Guid.NewGuid()}{fileExtension}";
                }

                // Construct the full key (path) in S3
                var key = string.IsNullOrEmpty(folderName)
                    ? fileName
                    : $"{folderName.TrimEnd('/')}/{fileName}";

                using (var fileStream = file.OpenReadStream())
                {
                    // Verify stream position
                    if (fileStream.Position > 0)
                    {
                        fileStream.Position = 0;
                    }

                    var uploadRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = fileStream,
                        BucketName = bucketName,
                        Key = key,
                        ContentType = file.ContentType ?? "application/octet-stream",
                        CannedACL = S3CannedACL.Private
                    };

                    var transferUtility = new TransferUtility(s3ClientWithCredentials);
                    await transferUtility.UploadAsync(uploadRequest);
                }

                return key;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error uploading file to S3: {ex.Message}", ex);
            }
        }

        public static async Task<byte[]> DownloadFileAsync(
            this IAmazonS3 s3Client,
            IConfiguration configuration,
            string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration), "Configuration cannot be null");
            }

            var bucketName = configuration["AWS:S3:BucketName"];
            var accessKey = configuration["AWS:S3:AccessKey"];
            var secretKey = configuration["AWS:S3:SecretKey"];
            var region = configuration["AWS:Region"] ?? "us-east-1";

            if (string.IsNullOrEmpty(bucketName))
            {
                throw new ArgumentException("S3 bucket name is not configured");
            }

            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentException("AWS credentials are not configured");
            }

            try
            {
                // Create client with explicit credentials
                var s3ClientWithCredentials = new AmazonS3Client(
                    accessKey,
                    secretKey,
                    RegionEndpoint.GetBySystemName(region)
                );

                var request = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = fileKey
                };

                using (var response = await s3ClientWithCredentials.GetObjectAsync(request))
                {
                    using (var responseStream = response.ResponseStream)
                    using (var memoryStream = new MemoryStream())
                    {
                        await responseStream.CopyToAsync(memoryStream);
                        return memoryStream.ToArray();
                    }
                }
            }
            catch (AmazonS3Exception ex)
            {
                throw new ApplicationException($"S3 error downloading file '{fileKey}': {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error downloading file '{fileKey}' from S3: {ex.Message}", ex);
            }
        }

        public static async Task DeleteFileAsync(
            this IAmazonS3 s3Client,
            IConfiguration configuration,
            string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration), "Configuration cannot be null");
            }

            var bucketName = configuration["AWS:S3:BucketName"];
            var accessKey = configuration["AWS:S3:AccessKey"];
            var secretKey = configuration["AWS:S3:SecretKey"];
            var region = configuration["AWS:Region"] ?? "us-east-1";

            if (string.IsNullOrEmpty(bucketName))
            {
                throw new ArgumentException("S3 bucket name is not configured");
            }

            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentException("AWS credentials are not configured");
            }

            try
            {
                // Create client with explicit credentials
                var s3ClientWithCredentials = new AmazonS3Client(
                    accessKey,
                    secretKey,
                    RegionEndpoint.GetBySystemName(region)
                );

                var request = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = fileKey
                };

                await s3ClientWithCredentials.DeleteObjectAsync(request);
            }
            catch (AmazonS3Exception ex)
            {
                throw new ApplicationException($"S3 error deleting file '{fileKey}': {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error deleting file '{fileKey}' from S3: {ex.Message}", ex);
            }
        }

        public static string GetFileUrl(
            this IConfiguration configuration,
            string fileKey)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration), "Configuration cannot be null");
            }

            if (string.IsNullOrEmpty(fileKey))
            {
                throw new ArgumentException("File key cannot be null or empty", nameof(fileKey));
            }

            var bucketName = configuration["AWS:S3:BucketName"];
            var region = configuration["AWS:Region"] ?? "us-east-1";

            if (string.IsNullOrEmpty(bucketName))
            {
                throw new ArgumentException("S3 bucket name is not configured");
            }

            if (string.IsNullOrEmpty(region))
            {
                throw new ArgumentException("AWS region is not configured");
            }

            // Generate a URL that follows the pattern: https://{bucket}.s3.{region}.amazonaws.com/{key}
            return $"https://{bucketName}.s3.{region}.amazonaws.com/{fileKey}";
        }
    }
}