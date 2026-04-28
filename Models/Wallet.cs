using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace U_Pocket.Models
{
    public class Wallet
    {
        [Key]
        public string WalletId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string StudentId { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0;

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
