using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.Models
{
    public class Tag : BaseEntity
    {
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<ImageTag> ImageTags { get; set; }
    }
}
