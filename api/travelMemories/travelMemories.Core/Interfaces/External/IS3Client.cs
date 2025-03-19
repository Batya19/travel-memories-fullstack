using System;
using System.IO;
using System.Threading.Tasks;

namespace travelMemories.Core.Interfaces.External
{
    public interface IS3Client
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<Stream> DownloadFileAsync(string key);
        Task DeleteFileAsync(string key);
        string GetPresignedUrl(string key, TimeSpan expiration);
    }
}