using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using travelMemories.Core.Interfaces.Repositories;
using travelMemories.Core.Models;
using travelMemories.Data.Context;

namespace travelMemories.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<int> GetUserCountAsync()
        {
            return await _dbContext.Users.CountAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }
    }
}