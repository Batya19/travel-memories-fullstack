using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.DTOs.File
{
    public class FileSearchRequest
    {
        public Guid? TripId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Location { get; set; }
    }
}
