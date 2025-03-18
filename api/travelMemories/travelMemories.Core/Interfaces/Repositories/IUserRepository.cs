using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using travelMemories.Core.Models;

namespace travelMemories.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(Guid id);
        Task<User> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(Guid id);
        Task<int> GetUserCountAsync();
        Task<bool> EmailExistsAsync(string email);
    }
}