using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Models
{
    public class Trip
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string LocationName { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual ICollection<File> Files { get; set; }
        public virtual ICollection<Collage> Collages { get; set; }
        public virtual ICollection<TripPoint> TripPoints { get; set; }
    }
}