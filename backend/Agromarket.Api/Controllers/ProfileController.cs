using System.Security.Claims;
using Agromarket.Application.DTOs;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ProfileResponse>> GetMyProfile()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(x => x.Role)
            .Include(x => x.Profile)
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user is null)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        if (user.Profile is null)
        {
            return NotFound(new
            {
                message = "Perfil no encontrado."
            });
        }

        return Ok(new ProfileResponse
        {
            Id = user.Profile.Id,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.Profile.FirstName,
            LastName = user.Profile.LastName,
            Phone = user.Profile.Phone,
            CompanyName = user.Profile.CompanyName,
            Address = user.Profile.Address,
            IsVerified = user.Profile.IsVerified,
            Role = user.Role.Name
        });
    }

    [HttpPut("me")]
    public async Task<ActionResult<ProfileResponse>> UpdateMyProfile(
        [FromBody] UpdateProfileRequest request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(x => x.Role)
            .Include(x => x.Profile)
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user is null)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        if (user.Profile is null)
        {
            return NotFound(new
            {
                message = "Perfil no encontrado."
            });
        }

        user.Profile.FirstName = request.FirstName.Trim();
        user.Profile.LastName = request.LastName.Trim();
        user.Profile.Phone = request.Phone?.Trim();
        user.Profile.CompanyName = request.CompanyName?.Trim();
        user.Profile.Address = request.Address?.Trim();

        await _context.SaveChangesAsync();

        return Ok(new ProfileResponse
        {
            Id = user.Profile.Id,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.Profile.FirstName,
            LastName = user.Profile.LastName,
            Phone = user.Profile.Phone,
            CompanyName = user.Profile.CompanyName,
            Address = user.Profile.Address,
            IsVerified = user.Profile.IsVerified,
            Role = user.Role.Name
        });
    }
}