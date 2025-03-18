using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.DTOs.File
{
    public class FileUploadRequest
    {
        [Required]
        public Guid TripId { get; set; }

        public List<string> Tags { get; set; } = new List<string>();
    }
}
