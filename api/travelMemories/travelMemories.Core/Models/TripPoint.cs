using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Models
{
    public class TripPoint
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Trip Trip { get; set; }
        public virtual ICollection<PointFile> PointFiles { get; set; }
    }

    public class PointFile
    {
        public Guid PointId { get; set; }
        public Guid FileId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual TripPoint TripPoint { get; set; }
        public virtual File File { get; set; }
    }
}