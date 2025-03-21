﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.DTOs.Auth
{
    public class AuthResponse
    {
        public Guid UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public UserDetails UserDetails { get; set; }
    }

    public class UserDetails
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public int StorageQuota { get; set; }
        public int StorageUsed { get; set; }
        public int AiQuota { get; set; }
        public int AiUsed { get; set; }
    }
}