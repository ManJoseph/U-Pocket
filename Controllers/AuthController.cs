using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using U_Pocket.Data;
using U_Pocket.Models;

namespace U_Pocket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly WalletDbContext _context;

        public AuthController(WalletDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var student = await _context.Students.FindAsync(request.StudentId);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            if (student.IsLocked)
            {
                return BadRequest("Account is locked due to too many failed attempts.");
            }

            if (student.Pin == request.Pin)
            {
                // Reset failed attempts on successful login
                student.FailedLoginAttempts = 0;
                await _context.SaveChangesAsync();
                
                return Ok(new { Message = "Login successful!", StudentId = student.StudentId, Name = student.Name });
            }
            else
            {
                // Increment failed attempts (only for non-admin users)
                if (student.StudentId != "ADMIN001")
                {
                    student.FailedLoginAttempts++;
                    if (student.FailedLoginAttempts >= 3)
                    {
                        student.IsLocked = true;
                    }
                    await _context.SaveChangesAsync();
                }

                if (student.IsLocked)
                {
                    return BadRequest(new { 
                        message = "Account Blocked", 
                        detail = "This account has been locked due to 3 failed attempts. Please contact the administrator to restore access." 
                    });
                }

                int remaining = 3 - student.FailedLoginAttempts;
                return BadRequest(new { 
                    message = "Invalid PIN", 
                    detail = student.StudentId == "ADMIN001" 
                        ? "The PIN entered is incorrect. Please try again."
                        : $"Warning: {remaining} attempt{(remaining == 1 ? "" : "s")} remaining. Your account will be blocked after 3 failed attempts."
                });
            }
        }
    }

    public class LoginRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public string Pin { get; set; } = string.Empty;
    }
}
