using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using travelMemories.Core.Models;
using File = travelMemories.Core.Models.File;

namespace travelMemories.Core.Interfaces.Repositories
{
    public interface IFileRepository
    {
        Task<File> GetByIdAsync(Guid id);
        Task<IEnumerable<File>> GetByTripIdAsync(Guid tripId);
        Task<IEnumerable<File>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<File>> SearchFilesAsync(Guid? tripId, IEnumerable<string> tags, DateTime? dateFrom, DateTime? dateTo, string location);
        Task<File> CreateAsync(File file);
        Task<File> UpdateAsync(File file);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<int> GetFileSizeByUserAsync(Guid userId);
        Task<int> GetFileCountByUserAsync(Guid userId);
        Task AddTagsToFileAsync(Guid fileId, IEnumerable<Guid> tagIds, Guid createdBy);
    }
}