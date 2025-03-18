using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.DTOs.File
{
    public class FileResponse
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public int FileSize { get; set; }
        public string MimeType { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime? TakenAt { get; set; }
        public Guid? TripId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
    }
}
