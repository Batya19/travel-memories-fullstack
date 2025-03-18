using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Models
{
    public class AIImage
    {
        public Guid Id { get; set; }
        public string Prompt { get; set; }
        public string Style { get; set; }
        public Guid FileId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? CreatedBy { get; set; }

        // Navigation properties
        public virtual File File { get; set; }
        public virtual User User { get; set; }
    }
}