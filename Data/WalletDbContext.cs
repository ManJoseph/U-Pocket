using Microsoft.EntityFrameworkCore;
using U_Pocket.Models;

namespace U_Pocket.Data
{
    public class WalletDbContext : DbContext
    {
        public WalletDbContext(DbContextOptions<WalletDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Wallet)
                .WithOne(w => w.Student)
                .HasForeignKey<Wallet>(w => w.StudentId);

            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.Transactions)
                .WithOne(t => t.Wallet)
                .HasForeignKey(t => t.WalletId);

            // Seed some initial data for testing
            modelBuilder.Entity<Student>().HasData(
                new Student { StudentId = "S101", Name = "John Doe", Pin = "1234" },
                new Student { StudentId = "S102", Name = "Jane Smith", Pin = "5678" }
            );

            modelBuilder.Entity<Wallet>().HasData(
                new Wallet { WalletId = "W101", StudentId = "S101", Balance = 1000 },
                new Wallet { WalletId = "W102", StudentId = "S102", Balance = 500 }
            );
        }
    }
}
