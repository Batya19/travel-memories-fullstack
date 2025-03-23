using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.Models;

namespace TravelMemories.Core.Models
{
    public class ImageTag
    {
        public Guid ImageId { get; set; }
        public Guid TagId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }

        // Navigation properties
        public virtual Image Image { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
