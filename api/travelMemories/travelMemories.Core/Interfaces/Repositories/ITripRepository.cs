using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Interfaces.Repositories
{
    public interface ITripRepository : IRepository<Trip>
    {
        Task<Trip> GetTripWithDetailsAsync(Guid tripId);
        Task<Trip> GetTripByShareIdAsync(Guid shareId);
        Task<IEnumerable<Trip>> GetUserTripsAsync(Guid userId);
        Task<Trip> GetTripWithImagesAsync(Guid tripId);
    }
}
