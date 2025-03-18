using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Models
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<FileTag> FileTags { get; set; }
    }

    public class FileTag
    {
        public Guid FileId { get; set; }
        public Guid TagId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }

        // Navigation properties
        public virtual File File { get; set; }
        public virtual Tag Tag { get; set; }
    }
}