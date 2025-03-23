using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelMemories.Core.DTOs.Admin
{
    public class SystemSettingsRequest
    {
        public int DefaultStorageQuota { get; set; }
        public int DefaultAiQuota { get; set; }
        public bool RegistrationEnabled { get; set; }
    }
}
