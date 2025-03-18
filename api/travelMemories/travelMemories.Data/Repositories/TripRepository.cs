using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using travelMemories.Core.Interfaces.Repositories;
using travelMemories.Core.Models;
using travelMemories.Data.Context;

namespace travelMemories.Data.Repositories
{
    public class TripRepository : BaseRepository<Trip>, ITripRepository
    {
        public TripRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Trip>> GetByUserIdAsync(Guid userId)
        {
            return await _dbContext.Trips
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.StartDate)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _dbContext.Trips.AnyAsync(t => t.Id == id);
        }

        public async Task<int> GetTripCountAsync()
        {
            return await _dbContext.Trips.CountAsync();
        }

        public async Task<int> GetTripCountByUserAsync(Guid userId)
        {
            return await _dbContext.Trips.CountAsync(t => t.UserId == userId);
        }

        public override async Task<Trip> GetByIdAsync(Guid id)
        {
            return await _dbContext.Trips
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}