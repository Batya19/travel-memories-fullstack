using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Models
{
    public class File
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; } // IMAGE, VIDEO, AUDIO
        public int FileSize { get; set; }
        public string MimeType { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime? TakenAt { get; set; }
        public Guid? TripId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Trip Trip { get; set; }
        public virtual ICollection<FileTag> FileTags { get; set; }
        public virtual ICollection<PointFile> PointFiles { get; set; }
        public virtual AIImage AIImage { get; set; }
    }
}