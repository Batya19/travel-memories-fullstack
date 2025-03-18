using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using travelMemories.Data.Context;

namespace travelMemories.Data.Repositories
{
    public abstract class BaseRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _dbContext;

        protected BaseRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public virtual async Task<T> CreateAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            _dbContext.Set<T>().Update(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbContext.Set<T>().Remove(entity);
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}