# U-Pocket: Technical Breakdown & logic Guide

This guide is designed to help you master the inner workings of the U-Pocket system, specifically focusing on the backend architecture and business logic. Use this to prepare for any technical questions or demonstrations.

---

## 1. System Architecture
U-Pocket is built as a **decoupled Full-Stack application**:
- **Backend:** ASP.NET Core Web API (C#) using Entity Framework Core.
- **Frontend:** React (Vite) with Tailwind CSS v4.
- **Database:** SQL Server (LocalDB) managed through EF Core Migrations.

The communication happens via **RESTful APIs**. The frontend sends JSON requests, and the backend processes them against a relational database.

---

## 2. Core Business Logic

### A. Authentication & Account Locking
**Where:** `Controllers/AuthController.cs` and `Models/Student.cs`

**The Logic:**
1. **Login Request:** The student provides their `StudentId` and `Pin`.
2. **Security Check:** 
   - If the account is already marked `IsLocked == true`, the system rejects the login immediately.
   - If not locked, the system compares the provided PIN with the one in the database.
3. **Failure Handling:**
   - If the PIN is wrong, the `FailedLoginAttempts` counter in the database is incremented.
   - Once the counter reaches **3**, the `IsLocked` boolean is set to `true`.
   - **Exemption:** The `ADMIN001` account is explicitly exempted from this locking logic to prevent total system lockout.
4. **Success Handling:**
   - Upon a correct PIN, the `FailedLoginAttempts` is reset to **0**.

### B. Transaction Processing (The "ATM" Flow)
**Where:** `Controllers/TransactionController.cs`

**The Flow:**
1. **Validation:** Before any money moves, the system performs "Pre-flight checks":
   - Does the sender have enough balance? (`Balance >= Amount`)
   - Is the amount positive?
   - For transfers: Does the recipient ID exist?
2. **Atomic Processing:** The system uses Entity Framework to ensure transactions are safe. For a transfer, it subtracts from User A and adds to User B in a single database save operation.
3. **Simulated Delay:** On the frontend, we've implemented a 4-second delay with a "Securing Transaction" spinner to mimic real-world banking encryption and verification steps.

### C. Reporting & Summaries
**Where:** `Controllers/ReportController.cs`

**The Logic:**
- **Transaction History:** A query filters the `Transactions` table by the student's `WalletId`, ordered by the most recent timestamp.
- **Daily Summary:** Uses `.Where(t => t.Timestamp.Date == DateTime.UtcNow.Date)` to aggregate only today's financial movements.
- **Stats:** Calculates "Total Deposits vs Payments" by summing the `Amount` field grouped by the `TransactionType` (0 = Deposit, 1 = Payment).

---

## 3. Key Services & Controllers

- **WalletController:** Manages "Profile" data and the "Change PIN" logic. It requires the current PIN as a "Security Challenge" before allowing a new PIN to be saved.
- **AdminController:** The "God-mode" of the system. It handles:
  - Student Registration (creating both a `Student` record and a `Wallet` simultaneously).
  - Manual Locking/Unlocking of student accounts.
  - Viewing the full directory of campus wallets.
- **DbContext (WalletDbContext):** The bridge between our C# code and the SQL Database. It defines the relationships (e.g., one Student has one Wallet, one Wallet has many Transactions).

---

## 4. Security Highlights
1. **CORS Policy:** We strictly allow only the specific Vite frontend (`localhost:5173`) to talk to the API.
2. **C# Data Annotations:** We use `[Required]` and `[StringLength(4)]` to ensure data integrity at the database level.
3. **Input Sanitization:** The use of Entity Framework automatically protects the system from SQL Injection attacks.
