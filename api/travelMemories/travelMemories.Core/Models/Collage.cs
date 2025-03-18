using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Text.Json;

namespace travelMemories.Core.Models
{
    public class Collage
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public JsonDocument CanvasData { get; set; }
        public Guid? TripId { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Trip Trip { get; set; }
        public virtual ICollection<CollageFile> CollageFiles { get; set; }
    }

    public class CollageFile
    {
        public Guid CollageId { get; set; }
        public Guid FileId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Collage Collage { get; set; }
        public virtual File File { get; set; }
    }
}