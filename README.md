# U-Pocket

U-Pocket is a modern, student-centric digital wallet system designed for campus life. It bridges the gap between traditional banking and campus services, allowing students to manage their finances, pay for essentials, and transfer funds with speed and security.

## The Concept
University life moves fast, and payments should too. U-Pocket simulates a real-world banking environment where students can handle their daily expenses—from cafeteria meals to library printing—through a secure digital interface. It includes a robust backend that enforces financial rules, prevents overspending, and protects accounts through automated security measures.

## Core Capabilities
- **Digital ATM Flow:** Experience realistic transaction processing with secure verification delays and instant confirmation.
- **Campus Ecosystem:** Pay for university services or transfer money to peers instantly using only a Student ID.
- **Security First:** Accounts automatically lock after 3 failed PIN attempts, mirroring professional banking security.
- **Financial Clarity:** Real-time reporting on daily summaries and total deposits vs. payments helps students stay on top of their budget.
- **Admin Control Center:** A dedicated portal for campus staff to register new students, monitor system health, and manage account security.

## Tech Stack
- **Backend:** .NET Core Web API with Entity Framework Core
- **Frontend:** React.js, Tailwind CSS v4, and Lucide Icons
- **Database:** SQL Server
- **State Management:** React Hooks (useState/useEffect)

## Setup & Exploration

### Backend
1. Open the project in Visual Studio or VS Code.
2. Update the connection string in `appsettings.json` to point to your SQL Server instance.
3. Run `dotnet ef database update` to initialize the schema.
4. Launch the API.

### Frontend
1. Navigate to the `u-pocket-ui` directory.
2. Install dependencies: `npm install`
3. Launch the development server: `npm run dev`

---
*Created as a solution for the Practical Assignment on Web API - Student Bank Wallet System.*
