using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using travelMemories.Core.DTOs.File;
using travelMemories.Core.Models;

namespace travelMemories.Core.Interfaces
{
    public interface IFileService
    {
        Task<IEnumerable<FileResponse>> UploadFilesAsync(IFormFileCollection files, Guid tripId, IEnumerable<string> tags, Guid userId);
        Task<IEnumerable<FileResponse>> GetFilesByTripIdAsync(Guid tripId);
        Task<IEnumerable<FileResponse>> SearchFilesAsync(FileSearchRequest request, Guid userId);
        Task<FileResponse> GetFileByIdAsync(Guid id);
        Task<bool> DeleteFileAsync(Guid id, Guid userId);
        Task<bool> AddTagsToFileAsync(Guid fileId, IEnumerable<string> tagNames, Guid userId);
        Task<int> GetUserStorageUsedAsync(Guid userId);
    }
}