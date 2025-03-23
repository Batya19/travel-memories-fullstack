using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.DTOs.AIImage
{
    public class AIImageRequest
    {
        [Required]
        [MaxLength(500)]
        public string Prompt { get; set; }

        [MaxLength(50)]
        public string Style { get; set; }

        public string Size { get; set; } = "512x512";

        public Guid? TripId { get; set; }
    }
}
