using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace U_Pocket.Models
{
    public enum TransactionType
    {
        Deposit,
        Payment,
        Transfer
    }

    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string WalletId { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public TransactionType Type { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string Description { get; set; } = string.Empty;

        // For transfers, record the recipient/sender ID
        public string? RelatedStudentId { get; set; }

        // Navigation property
        [ForeignKey("WalletId")]
        public Wallet? Wallet { get; set; }
    }
}
