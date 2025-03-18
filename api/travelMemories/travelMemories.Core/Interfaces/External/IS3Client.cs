// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace travelMemories.Core.Interfaces.External
{
    public interface IS3Client
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<bool> DeleteFileAsync(string filePath);
        Task<string> GetPreSignedUrl(string filePath, TimeSpan expiry);
    }
}