using System.ComponentModel.DataAnnotations;

namespace U_Pocket.Models
{
    public class Student
    {
        [Key]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(4, MinimumLength = 4)]
        public string Pin { get; set; } = string.Empty;
        
        public int FailedLoginAttempts { get; set; } = 0;
        
        public bool IsLocked { get; set; } = false;

        // Navigation property
        public Wallet? Wallet { get; set; }
    }
}
