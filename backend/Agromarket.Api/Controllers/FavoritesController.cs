using System.Security.Claims;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Comprador")]
public class FavoritesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FavoritesController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var favorites = await _context.Favorites
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId.Value)
            .OrderByDescending(x =>
                x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.PublicationId,
                x.CreatedAt,

                Publication = new
                {
                    x.Publication.Id,
                    x.Publication.Title,
                    x.Publication.Description,
                    x.Publication.Price,
                    x.Publication.Stock,
                    x.Publication.Unit,
                    x.Publication.Category,
                    x.Publication.MinimumOrder,
                    x.Publication.Department,
                    x.Publication.Municipality,
                    x.Publication.ImageUrl,
                    x.Publication.IsActive,
                    x.Publication.CreatedAt,

                    Seller = new
                    {
                        x.Publication.User.Id,
                        x.Publication.User.Email
                    }
                }
            })
            .ToListAsync();

        return Ok(favorites);
    }

    [HttpGet("{publicationId:guid}/check")]
    public async Task<IActionResult> Check(
        Guid publicationId)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var isFavorite =
            await _context.Favorites
                .AsNoTracking()
                .AnyAsync(x =>
                    x.UserId == userId.Value &&
                    x.PublicationId == publicationId);

        return Ok(new
        {
            publicationId,
            isFavorite
        });
    }

    [HttpPost("{publicationId:guid}")]
    public async Task<IActionResult> Add(
        Guid publicationId)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var userExists =
            await _context.Users
                .AnyAsync(x =>
                    x.Id == userId.Value &&
                    x.IsActive);

        if (!userExists)
        {
            return NotFound(new
            {
                message =
                    "Usuario no encontrado."
            });
        }

        var publication =
            await _context.Publications
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Id == publicationId);

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        if (
            !publication.IsActive ||
            publication.Stock <= 0
        )
        {
            return BadRequest(new
            {
                message =
                    "Esta publicación ya no está disponible."
            });
        }

        var alreadyExists =
            await _context.Favorites
                .AnyAsync(x =>
                    x.UserId == userId.Value &&
                    x.PublicationId == publicationId);

        if (alreadyExists)
        {
            return Ok(new
            {
                publicationId,
                isFavorite = true
            });
        }

        var favorite =
            new Favorite
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                PublicationId =
                    publicationId,
                CreatedAt =
                    DateTime.UtcNow
            };

        _context.Favorites.Add(
            favorite
        );

        await _context.SaveChangesAsync();

        return Created(
            "",
            new
            {
                favorite.Id,
                favorite.PublicationId,
                favorite.CreatedAt,
                isFavorite = true
            }
        );
    }

    [HttpDelete("{publicationId:guid}")]
    public async Task<IActionResult> Remove(
        Guid publicationId)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var favorite =
            await _context.Favorites
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId.Value &&
                    x.PublicationId ==
                        publicationId);

        if (favorite is null)
        {
            return NoContent();
        }

        _context.Favorites.Remove(
            favorite
        );

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var value =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (
            !Guid.TryParse(
                value,
                out var userId)
        )
        {
            return null;
        }

        return userId;
    }
}