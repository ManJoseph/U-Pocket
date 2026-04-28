using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using U_Pocket.Data;
using U_Pocket.Models;

namespace U_Pocket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly WalletDbContext _context;

        public TransactionController(WalletDbContext context)
        {
            _context = context;
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
        {
            if (request.Amount <= 0) return BadRequest("Amount must be greater than zero.");

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == request.StudentId);
            if (wallet == null) return NotFound("Wallet not found.");

            wallet.Balance += request.Amount;

            var transaction = new Transaction
            {
                WalletId = wallet.WalletId,
                Amount = request.Amount,
                Type = TransactionType.Deposit,
                Description = "Cash Deposit",
                Timestamp = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Deposit successful", NewBalance = wallet.Balance });
        }

        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] PayRequest request)
        {
            if (request.Amount <= 0) return BadRequest("Amount must be greater than zero.");

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == request.StudentId);
            if (wallet == null) return NotFound("Wallet not found.");

            if (wallet.Balance < request.Amount)
            {
                return BadRequest("Insufficient balance.");
            }

            wallet.Balance -= request.Amount;

            var transaction = new Transaction
            {
                WalletId = wallet.WalletId,
                Amount = request.Amount,
                Type = TransactionType.Payment,
                Description = $"Payment for {request.Service}",
                Timestamp = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Payment successful", NewBalance = wallet.Balance });
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            if (request.Amount <= 0) return BadRequest("Amount must be greater than zero.");
            if (request.FromStudentId == request.ToStudentId) return BadRequest("Cannot transfer to yourself.");

            var senderWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == request.FromStudentId);
            var receiverWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == request.ToStudentId);

            if (senderWallet == null) return NotFound("Sender wallet not found.");
            if (receiverWallet == null) return NotFound("Receiver student/wallet not found.");

            if (senderWallet.Balance < request.Amount)
            {
                return BadRequest("Insufficient balance.");
            }

            // Deduct from sender
            senderWallet.Balance -= request.Amount;
            _context.Transactions.Add(new Transaction
            {
                WalletId = senderWallet.WalletId,
                Amount = request.Amount,
                Type = TransactionType.Transfer,
                Description = $"Transfer to {request.ToStudentId}",
                RelatedStudentId = request.ToStudentId,
                Timestamp = DateTime.UtcNow
            });

            // Add to receiver
            receiverWallet.Balance += request.Amount;
            _context.Transactions.Add(new Transaction
            {
                WalletId = receiverWallet.WalletId,
                Amount = request.Amount,
                Type = TransactionType.Transfer,
                Description = $"Transfer from {request.FromStudentId}",
                RelatedStudentId = request.FromStudentId,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Transfer successful", NewBalance = senderWallet.Balance });
        }
    }

    public class DepositRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class PayRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Service { get; set; } = "General Service";
    }

    public class TransferRequest
    {
        public string FromStudentId { get; set; } = string.Empty;
        public string ToStudentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
