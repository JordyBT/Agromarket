using Agromarket.Application.DTOs;
using Agromarket.Application.Interfaces;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        ApplicationDbContext context,
        IPasswordHasher<User> passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
{
    var normalizedEmail = request.Email.Trim().ToLowerInvariant();

    var emailExists = await _context.Users
        .AnyAsync(x => x.Email == normalizedEmail);

    if (emailExists)
    {
        throw new InvalidOperationException(
            "Ya existe un usuario registrado con este correo electrónico.");
    }

    var allowedRoles = new[] { "Comprador", "Proveedor" };

    if (!allowedRoles.Contains(request.Role))
    {
        throw new InvalidOperationException(
            "El rol indicado no está permitido para el registro público.");
    }

    var role = await _context.Roles
        .FirstOrDefaultAsync(x => x.Name == request.Role);

    if (role is null)
    {
        throw new InvalidOperationException(
            "El rol indicado no existe.");
    }

    var user = new User
    {
        Id = Guid.NewGuid(),
        Email = normalizedEmail,
        RoleId = role.Id,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password
        );

        var profile = new UserProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Phone = request.Phone?.Trim(),
            CompanyName = request.CompanyName?.Trim(),
            IsVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        user.Profile = profile;

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new RegisterResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = $"{profile.FirstName} {profile.LastName}",
            Role = role.Name
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .Include(x => x.Role)
            .Include(x => x.Profile)
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "Correo electrónico o contraseña incorrectos.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException(
                "La cuenta se encuentra deshabilitada.");
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException(
                "Correo electrónico o contraseña incorrectos.");
        }

        var (token, expiresAt) = _jwtTokenService.GenerateToken(user);

        var fullName = user.Profile is null
            ? string.Empty
            : $"{user.Profile.FirstName} {user.Profile.LastName}";

        return new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FullName = fullName,
            Role = user.Role.Name
        };
    }
}