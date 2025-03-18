using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using travelMemories.Core.Models;

namespace travelMemories.Core.Interfaces.Repositories
{
    public interface ITripRepository
    {
        Task<Trip> GetByIdAsync(Guid id);
        Task<IEnumerable<Trip>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<Trip>> GetAllAsync();
        Task<Trip> CreateAsync(Trip trip);
        Task<Trip> UpdateAsync(Trip trip);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<int> GetTripCountAsync();
        Task<int> GetTripCountByUserAsync(Guid userId);
    }
}