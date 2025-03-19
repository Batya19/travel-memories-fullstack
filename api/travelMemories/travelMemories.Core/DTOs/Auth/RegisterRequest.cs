using System;
using System.ComponentModel.DataAnnotations;

namespace travelMemories.Core.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}