using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.DTOs.Tag
{
    public class TagRequest
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
    }
}
