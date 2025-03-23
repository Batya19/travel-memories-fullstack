using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.DTOs.Image
{
    public class ImageUploadRequest
    {
        [Required]
        public IFormFile[] Files { get; set; }

        public Guid? TripId { get; set; }

        public string[] Tags { get; set; }
    }
}
