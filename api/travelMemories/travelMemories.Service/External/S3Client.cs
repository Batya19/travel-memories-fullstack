using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;
using travelMemories.Core.Interfaces.External;

namespace travelMemories.Service.External
{
    public class S3Client : IS3Client
    {
        private readonly string _bucketName;
        private readonly IAmazonS3 _s3Client;

        public S3Client(IConfiguration configuration)
        {
            var awsConfig = configuration.GetSection("AWS");
            _bucketName = awsConfig["BucketName"];

            var credentials = new Amazon.Runtime.BasicAWSCredentials(
                awsConfig["AccessKey"],
                awsConfig["SecretKey"]);

            _s3Client = new AmazonS3Client(
                credentials,
                RegionEndpoint.GetBySystemName(awsConfig["Region"]));
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            try
            {
                var fileTransferUtility = new TransferUtility(_s3Client);

                var uploadRequest = new TransferUtilityUploadRequest
                {
                    InputStream = fileStream,
                    Key = $"{Guid.NewGuid()}-{fileName}",
                    BucketName = _bucketName,
                    ContentType = contentType,
                    CannedACL = S3CannedACL.Private
                };

                await fileTransferUtility.UploadAsync(uploadRequest);

                return uploadRequest.Key;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading file to S3: {ex.Message}");
            }
        }

        public async Task<Stream> DownloadFileAsync(string key)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                var response = await _s3Client.GetObjectAsync(request);
                var memoryStream = new MemoryStream();

                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                return memoryStream;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error downloading file from S3: {ex.Message}");
            }
        }

        public async Task DeleteFileAsync(string key)
        {
            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                await _s3Client.DeleteObjectAsync(deleteObjectRequest);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting file from S3: {ex.Message}");
            }
        }

        public string GetPresignedUrl(string key, TimeSpan expiration)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    Expires = DateTime.UtcNow.Add(expiration)
                };

                return _s3Client.GetPreSignedURL(request);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating presigned URL: {ex.Message}");
            }
        }
    }
}