using System.Security.Claims;
using Agromarket.Application.DTOs;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReservationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Comprador")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateReservationRequest request)
    {
        var buyerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(buyerIdValue, out var buyerId))
        {
            return Unauthorized();
        }

        var buyerExists = await _context.Users
            .AnyAsync(x =>
                x.Id == buyerId &&
                x.IsActive);

        if (!buyerExists)
        {
            return Unauthorized();
        }

        var publication = await _context.Publications
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Id == request.PublicationId);

        if (publication is null)
        {
            return NotFound(new
            {
                message = "Publicación no encontrada."
            });
        }

        if (!publication.IsActive)
        {
            return BadRequest(new
            {
                message = "La publicación no está disponible."
            });
        }

        if (publication.UserId == buyerId)
        {
            return BadRequest(new
            {
                message = "No puedes reservar tu propia publicación."
            });
        }

        if (request.Quantity < publication.MinimumOrder)
        {
            return BadRequest(new
            {
                message =
                    $"La compra mínima es de {publication.MinimumOrder} {publication.Unit}."
            });
        }

        if (request.Quantity > publication.Stock)
        {
            return BadRequest(new
            {
                message = "La cantidad solicitada supera el inventario disponible."
            });
        }

        var hasPendingReservation =
            await _context.Reservations.AnyAsync(x =>
                x.BuyerId == buyerId &&
                x.PublicationId == publication.Id &&
                x.Status == ReservationStatus.Pending);

        if (hasPendingReservation)
        {
            return Conflict(new
            {
                message = "Ya tienes una reserva pendiente para esta publicación."
            });
        }

        var reservation = new Reservation
        {
            Id = Guid.NewGuid(),
            PublicationId = publication.Id,
            BuyerId = buyerId,
            Quantity = request.Quantity,
            UnitPrice = publication.Price,
            Status = ReservationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return Created("", new
        {
            reservation.Id,
            reservation.PublicationId,
            reservation.Quantity,
            reservation.UnitPrice,
            TotalPrice =
                reservation.UnitPrice * reservation.Quantity,
            Status = reservation.Status.ToString(),
            reservation.CreatedAt
        });
    }

    [Authorize(Roles = "Comprador")]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var buyerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(buyerIdValue, out var buyerId))
        {
            return Unauthorized();
        }

        var reservations = await _context.Reservations
            .AsNoTracking()
            .Where(x => x.BuyerId == buyerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.PublicationId,
                PublicationTitle = x.Publication.Title,
                x.Quantity,
                x.UnitPrice,
                TotalPrice = x.UnitPrice * x.Quantity,
                Unit = x.Publication.Unit,
                Status = x.Status.ToString(),
                x.CreatedAt,
                x.ResolvedAt,
                Seller = new
                {
                    x.Publication.User.Id,
                    x.Publication.User.Email
                }
            })
            .ToListAsync();

        return Ok(reservations);
    }

    [Authorize(Roles = "Proveedor")]
    [HttpGet("received")]
    public async Task<IActionResult> GetReceived()
    {
        var providerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                providerIdValue,
                out var providerId))
        {
            return Unauthorized();
        }

        var reservations = await _context.Reservations
            .AsNoTracking()
            .Where(x =>
                x.Publication.UserId == providerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.PublicationId,
                PublicationTitle = x.Publication.Title,
                x.Quantity,
                x.UnitPrice,
                TotalPrice = x.UnitPrice * x.Quantity,
                Unit = x.Publication.Unit,
                Status = x.Status.ToString(),
                x.CreatedAt,
                x.ResolvedAt,
                Buyer = new
                {
                    x.Buyer.Id,
                    x.Buyer.Email,
                    FirstName = x.Buyer.Profile != null
                        ? x.Buyer.Profile.FirstName
                        : "",
                    LastName = x.Buyer.Profile != null
                        ? x.Buyer.Profile.LastName
                        : ""
                }
            })
            .ToListAsync();

        return Ok(reservations);
    }

    [Authorize(Roles = "Proveedor")]
    [HttpPatch("{id:guid}/accept")]
    public async Task<IActionResult> Accept(Guid id)
    {
        var providerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                providerIdValue,
                out var providerId))
        {
            return Unauthorized();
        }

        var reservation = await _context.Reservations
            .Include(x => x.Publication)
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.Publication.UserId == providerId);

        if (reservation is null)
        {
            return NotFound(new
            {
                message = "Reserva no encontrada."
            });
        }

        if (reservation.Status != ReservationStatus.Pending)
        {
            return BadRequest(new
            {
                message = "La reserva ya fue procesada."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        var affectedRows = await _context.Publications
            .Where(x =>
                x.Id == reservation.PublicationId &&
                x.Stock >= reservation.Quantity)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(
                    x => x.Stock,
                    x => x.Stock - reservation.Quantity));

        if (affectedRows == 0)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "Ya no existe inventario suficiente para aceptar esta reserva."
            });
        }

        var remainingStock = await _context.Publications
            .Where(x => x.Id == reservation.PublicationId)
            .Select(x => x.Stock)
            .SingleAsync();

        if (remainingStock == 0)
        {
            await _context.Publications
                .Where(x =>
                    x.Id == reservation.PublicationId)
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(
                        x => x.IsActive,
                        false));
        }

        reservation.Status =
            ReservationStatus.Accepted;

        reservation.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            reservation.Id,
            Status = reservation.Status.ToString(),
            reservation.Quantity,
            RemainingStock = remainingStock,
            reservation.ResolvedAt
        });
    }

    [Authorize(Roles = "Proveedor")]
    [HttpPatch("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var providerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                providerIdValue,
                out var providerId))
        {
            return Unauthorized();
        }

        var reservation = await _context.Reservations
            .Include(x => x.Publication)
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.Publication.UserId == providerId);

        if (reservation is null)
        {
            return NotFound(new
            {
                message = "Reserva no encontrada."
            });
        }

        if (reservation.Status != ReservationStatus.Pending)
        {
            return BadRequest(new
            {
                message = "La reserva ya fue procesada."
            });
        }

        reservation.Status =
            ReservationStatus.Rejected;

        reservation.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            Status = reservation.Status.ToString(),
            reservation.ResolvedAt
        });
    }

    [Authorize(Roles = "Comprador")]
    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var buyerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(buyerIdValue, out var buyerId))
        {
            return Unauthorized();
        }

        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.BuyerId == buyerId);

        if (reservation is null)
        {
            return NotFound(new
            {
                message = "Reserva no encontrada."
            });
        }

        if (reservation.Status != ReservationStatus.Pending)
        {
            return BadRequest(new
            {
                message = "Solo puedes cancelar reservas pendientes."
            });
        }

        reservation.Status =
            ReservationStatus.Cancelled;

        reservation.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            Status = reservation.Status.ToString(),
            reservation.ResolvedAt
        });
    }
}