using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.Interfaces.External
{

    public interface IS3Service
    {
        Task<string> UploadFileAsync(IFormFile file, string folderName, string? fileName = null);
        Task<byte[]> DownloadFileAsync(string fileKey);
        Task DeleteFileAsync(string fileKey);
        string GetFileUrl(string fileKey);
    }
}