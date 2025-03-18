using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.DTOs.Trip
{
    public class TripResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string LocationName { get; set; }
        public int FileCount { get; set; }
        public int CollageCount { get; set; }
        public int PointCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
