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

            Console.WriteLine($"[S3Helper] Starting upload to S3. Bucket: {bucketName}, Folder: {folderName}, FileName: {fileName}, FileSize: {file.Length} bytes, ContentType: {file.ContentType}");

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
                    Console.WriteLine($"[S3Helper] Generated unique filename: {fileName}");
                }

                // Construct the full key (path) in S3
                var key = string.IsNullOrEmpty(folderName)
                    ? fileName
                    : $"{folderName.TrimEnd('/')}/{fileName}";

                Console.WriteLine($"[S3Helper] Constructed S3 key: {key}");

                using (var fileStream = file.OpenReadStream())
                {
                    Console.WriteLine($"[S3Helper] Opened file stream, length: {fileStream.Length} bytes");

                    // Verify stream position
                    if (fileStream.Position > 0)
                    {
                        Console.WriteLine($"[S3Helper] Warning: Stream position is not at 0, current position: {fileStream.Position}");
                        fileStream.Position = 0;
                    }

                    var uploadRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = fileStream,
                        BucketName = bucketName,
                        Key = key,
                        ContentType = file.ContentType ?? "application/octet-stream", // Default content type if null
                        CannedACL = S3CannedACL.Private
                    };

                    Console.WriteLine($"[S3Helper] Upload request created with ContentType: {uploadRequest.ContentType}");

                    var transferUtility = new TransferUtility(s3ClientWithCredentials);
                    Console.WriteLine($"[S3Helper] Starting actual upload to S3...");
                    await transferUtility.UploadAsync(uploadRequest);
                    Console.WriteLine($"[S3Helper] Upload completed successfully!");
                }

                // Generate URL to verify existence
                var fileUrl = GetFileUrl(configuration, key);
                Console.WriteLine($"[S3Helper] File URL: {fileUrl}");

                return key;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[S3Helper] ERROR uploading file to S3: {ex.Message}");
                Console.WriteLine($"[S3Helper] Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[S3Helper] Inner exception: {ex.InnerException.Message}");
                }
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

            Console.WriteLine($"[S3Helper] Downloading file from S3. Bucket: {bucketName}, FileKey: {fileKey}");

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

                Console.WriteLine($"[S3Helper] Sending GetObject request to S3...");

                using (var response = await s3ClientWithCredentials.GetObjectAsync(request))
                {
                    Console.WriteLine($"[S3Helper] GetObject response received. ContentLength: {response.ContentLength}, ContentType: {response.Headers.ContentType}");

                    using (var responseStream = response.ResponseStream)
                    using (var memoryStream = new MemoryStream())
                    {
                        await responseStream.CopyToAsync(memoryStream);
                        var bytes = memoryStream.ToArray();
                        Console.WriteLine($"[S3Helper] Successfully read {bytes.Length} bytes from S3");
                        return bytes;
                    }
                }
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"[S3Helper] S3 ERROR downloading file '{fileKey}': {ex.Message}, ErrorCode: {ex.ErrorCode}, StatusCode: {ex.StatusCode}");
                Console.WriteLine($"[S3Helper] Stack trace: {ex.StackTrace}");
                throw new ApplicationException($"S3 error downloading file '{fileKey}': {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[S3Helper] ERROR downloading file '{fileKey}' from S3: {ex.Message}");
                Console.WriteLine($"[S3Helper] Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[S3Helper] Inner exception: {ex.InnerException.Message}");
                }
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