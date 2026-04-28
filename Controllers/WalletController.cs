using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using U_Pocket.Data;

namespace U_Pocket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly WalletDbContext _context;

        public WalletController(WalletDbContext context)
        {
            _context = context;
        }

        [HttpGet("{studentId}/balance")]
        public async Task<IActionResult> GetBalance(string studentId)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.StudentId == studentId);

            if (wallet == null)
            {
                return NotFound("Wallet not found.");
            }

            return Ok(new { StudentId = studentId, Balance = wallet.Balance });
        }

        [HttpGet("{studentId}/profile")]
        public async Task<IActionResult> GetProfile(string studentId)
        {
            var student = await _context.Students
                .Include(s => s.Wallet)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            return Ok(new
            {
                student.StudentId,
                student.Name,
                WalletId = student.Wallet?.WalletId,
                Balance = student.Wallet?.Balance ?? 0,
                student.IsLocked
            });
        }

        [HttpPost("change-pin")]
        public async Task<IActionResult> ChangePin([FromBody] ChangePinRequest request)
        {
            var student = await _context.Students.FindAsync(request.StudentId);
            if (student == null) return NotFound("Student not found.");

            if (student.Pin != request.CurrentPin)
            {
                return BadRequest(new { message = "Security Check Failed", detail = "Current PIN is incorrect." });
            }

            if (request.NewPin.Length != 4 || !request.NewPin.All(char.IsDigit))
            {
                return BadRequest(new { message = "Invalid Format", detail = "New PIN must be exactly 4 digits." });
            }

            student.Pin = request.NewPin;
            await _context.SaveChangesAsync();

            return Ok(new { message = "PIN Updated Successfully!" });
        }
    }

    public class ChangePinRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public string CurrentPin { get; set; } = string.Empty;
        public string NewPin { get; set; } = string.Empty;
    }
}
