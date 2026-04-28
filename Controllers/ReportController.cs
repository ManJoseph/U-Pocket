using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using U_Pocket.Data;
using U_Pocket.Models;

namespace U_Pocket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly WalletDbContext _context;

        public ReportController(WalletDbContext context)
        {
            _context = context;
        }

        [HttpGet("{studentId}/history")]
        public async Task<IActionResult> GetHistory(string studentId)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == studentId);
            if (wallet == null) return NotFound("Wallet not found.");

            var history = await _context.Transactions
                .Where(t => t.WalletId == wallet.WalletId)
                .OrderByDescending(t => t.Timestamp)
                .ToListAsync();

            return Ok(history);
        }

        [HttpGet("daily-summary")]
        public async Task<IActionResult> GetDailySummary()
        {
            var today = DateTime.UtcNow.Date;

            var transactionsToday = await _context.Transactions
                .Where(t => t.Timestamp.Date == today)
                .ToListAsync();

            var summary = new
            {
                Date = today,
                TotalDeposits = transactionsToday.Where(t => t.Type == TransactionType.Deposit).Sum(t => t.Amount),
                TotalPayments = transactionsToday.Where(t => t.Type == TransactionType.Payment).Sum(t => t.Amount),
                TotalTransfers = transactionsToday.Where(t => t.Type == TransactionType.Transfer).Sum(t => t.Amount),
                TransactionCount = transactionsToday.Count
            };

            return Ok(summary);
        }

        [HttpGet("total-stats")]
        public async Task<IActionResult> GetTotalStats()
        {
            var transactions = await _context.Transactions.ToListAsync();

            var stats = new
            {
                TotalDeposits = transactions.Where(t => t.Type == TransactionType.Deposit).Sum(t => t.Amount),
                TotalPayments = transactions.Where(t => t.Type == TransactionType.Payment).Sum(t => t.Amount),
                TotalTransfers = transactions.Where(t => t.Type == TransactionType.Transfer).Sum(t => t.Amount) / 2, // Divided by 2 because each transfer has 2 entries
                OverallBalance = transactions.Where(t => t.Type == TransactionType.Deposit).Sum(t => t.Amount) - transactions.Where(t => t.Type == TransactionType.Payment).Sum(t => t.Amount)
            };

            return Ok(stats);
        }
    }
}
