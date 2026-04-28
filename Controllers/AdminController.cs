using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using U_Pocket.Data;
using U_Pocket.Models;

namespace U_Pocket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly WalletDbContext _context;

        public AdminController(WalletDbContext context)
        {
            _context = context;
        }

        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _context.Students
                .Include(s => s.Wallet)
                .Where(s => s.StudentId != "ADMIN001")
                .Select(s => new
                {
                    s.StudentId,
                    s.Name,
                    s.IsLocked,
                    s.FailedLoginAttempts,
                    Balance = s.Wallet != null ? s.Wallet.Balance : 0
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterRequest request)
        {
            if (await _context.Students.AnyAsync(s => s.StudentId == request.StudentId))
                return BadRequest("Student ID already exists.");

            var student = new Student
            {
                StudentId = request.StudentId,
                Name = request.Name,
                Pin = request.Pin,
                IsLocked = false
            };

            var wallet = new Wallet
            {
                StudentId = student.StudentId,
                Balance = request.InitialBalance,
                WalletId = "W_" + student.StudentId
            };

            _context.Students.Add(student);
            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Student registered successfully!" });
        }

        [HttpPost("unlock/{studentId}")]
        public async Task<IActionResult> UnlockAccount(string studentId)
        {
            var student = await _context.Students.FindAsync(studentId);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            student.IsLocked = false;
            student.FailedLoginAttempts = 0;
            
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Account for student {studentId} has been unlocked." });
        }

        [HttpPost("lock/{studentId}")]
        public async Task<IActionResult> LockAccount(string studentId)
        {
            var student = await _context.Students.FindAsync(studentId);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            student.IsLocked = true;
            
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Account for student {studentId} has been locked." });
        }
    }

    public class RegisterRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Pin { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; }
    }
}
