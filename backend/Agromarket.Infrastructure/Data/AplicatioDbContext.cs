using Agromarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Publication> Publications => Set<Publication>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.PasswordHash)
                .IsRequired();

            entity.HasOne(x => x.Role)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Profile)
                .WithOne(x => x.User)
                .HasForeignKey<UserProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(x => x.Name)
                .IsUnique();
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.LastName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Phone)
                .HasMaxLength(30);

            entity.Property(x => x.CompanyName)
                .HasMaxLength(200);

            entity.Property(x => x.Address)
                .HasMaxLength(300);
        });

        modelBuilder.Entity<Publication>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(x => x.Price)
                .HasPrecision(12, 2);

            entity.Property(x => x.Unit)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(x => x.Category)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(x => x.Department)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Municipality)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasOne(x => x.User)
                .WithMany(x => x.Publications)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Quantity)
                .IsRequired();

            entity.Property(x => x.UnitPrice)
                .HasPrecision(12, 2);

            entity.Property(x => x.Status)
                .HasConversion<string>()
                .IsRequired()
                .HasMaxLength(30);

            entity.HasIndex(x => x.PublicationId);
            entity.HasIndex(x => x.BuyerId);
            entity.HasIndex(x => x.Status);

            entity.HasOne(x => x.Publication)
                .WithMany(x => x.Reservations)
                .HasForeignKey(x => x.PublicationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Buyer)
                .WithMany(x => x.ReservationsAsBuyer)
                .HasForeignKey(x => x.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        var compradorRoleId =
            Guid.Parse("11111111-1111-1111-1111-111111111111");

        var proveedorRoleId =
            Guid.Parse("22222222-2222-2222-2222-222222222222");

        var administradorRoleId =
            Guid.Parse("33333333-3333-3333-3333-333333333333");

        modelBuilder.Entity<Role>().HasData(
            new Role
            {
                Id = compradorRoleId,
                Name = "Comprador",
                CreatedAt = new DateTime(
                    2026, 9, 30, 0, 0, 0,
                    DateTimeKind.Utc)
            },
            new Role
            {
                Id = proveedorRoleId,
                Name = "Proveedor",
                CreatedAt = new DateTime(
                    2026, 9, 30, 0, 0, 0,
                    DateTimeKind.Utc)
            },
            new Role
            {
                Id = administradorRoleId,
                Name = "Administrador",
                CreatedAt = new DateTime(
                    2026, 9, 30, 0, 0, 0,
                    DateTimeKind.Utc)
            }
        );
    }
}