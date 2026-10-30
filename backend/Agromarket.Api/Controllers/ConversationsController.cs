using System.Security.Claims;
using Agromarket.Application.DTOs;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/conversations")]
[Authorize(Roles = "Comprador,Proveedor")]
public class ConversationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ConversationsController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("publication/{publicationId:guid}")]
    [Authorize(Roles = "Comprador")]
    public async Task<IActionResult> StartConversation(
        Guid publicationId)
    {
        var buyerId =
            GetCurrentUserId();

        if (buyerId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Id == publicationId
                );

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        var providerId =
            publication.UserId;

        if (providerId == buyerId.Value)
        {
            return BadRequest(new
            {
                message =
                    "No puedes iniciar una conversación contigo mismo."
            });
        }

        var existing =
            await _context.Conversations
                .FirstOrDefaultAsync(x =>
                    x.PublicationId ==
                        publicationId &&
                    x.BuyerId ==
                        buyerId.Value &&
                    x.ProviderId ==
                        providerId
                );

        if (existing is not null)
        {
            return Ok(new
            {
                existing.Id,
                existing.PublicationId,
                existing.BuyerId,
                existing.ProviderId,
                existing.CreatedAt,
                existing.UpdatedAt
            });
        }

        var conversation =
            new Conversation
            {
                Id = Guid.NewGuid(),

                PublicationId =
                    publicationId,

                BuyerId =
                    buyerId.Value,

                ProviderId =
                    providerId,

                CreatedAt =
                    DateTime.UtcNow,

                UpdatedAt =
                    DateTime.UtcNow
            };

        _context.Conversations.Add(
            conversation
        );

        await _context.SaveChangesAsync();

        return Created("", new
        {
            conversation.Id,
            conversation.PublicationId,
            conversation.BuyerId,
            conversation.ProviderId,
            conversation.CreatedAt,
            conversation.UpdatedAt
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var conversations =
            await _context.Conversations
                .AsNoTracking()
                .Where(x =>
                    x.BuyerId ==
                        userId.Value ||
                    x.ProviderId ==
                        userId.Value
                )
                .OrderByDescending(x =>
                    x.UpdatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.PublicationId,
                    x.BuyerId,
                    x.ProviderId,
                    x.CreatedAt,
                    x.UpdatedAt,

                    Publication = new
                    {
                        x.Publication.Id,
                        x.Publication.Title,
                        x.Publication.ImageUrl,
                        x.Publication.Price,
                        x.Publication.Unit
                    },

                    OtherUser =
                        x.BuyerId ==
                        userId.Value
                            ? new
                            {
                                Id =
                                    x.Provider.Id,

                                Email =
                                    x.Provider.Email,

                                FirstName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.FirstName
                                        : "",

                                LastName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.LastName
                                        : "",

                                CompanyName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.CompanyName
                                        : ""
                            }
                            : new
                            {
                                Id =
                                    x.Buyer.Id,

                                Email =
                                    x.Buyer.Email,

                                FirstName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.FirstName
                                        : "",

                                LastName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.LastName
                                        : "",

                                CompanyName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.CompanyName
                                        : ""
                            },

                    LastMessage =
                        x.Messages
                            .OrderByDescending(m =>
                                m.CreatedAt
                            )
                            .Select(m => new
                            {
                                m.Id,
                                m.SenderId,
                                m.Content,
                                m.CreatedAt
                            })
                            .FirstOrDefault()
                })
                .ToListAsync();

        return Ok(conversations);
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(
        Guid id)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var conversation =
            await _context.Conversations
                .AsNoTracking()
                .Where(x =>
                    x.Id == id &&
                    (
                        x.BuyerId ==
                            userId.Value ||
                        x.ProviderId ==
                            userId.Value
                    )
                )
                .Select(x => new
                {
                    x.Id,
                    x.PublicationId,
                    x.BuyerId,
                    x.ProviderId,
                    x.CreatedAt,
                    x.UpdatedAt,

                    Publication = new
                    {
                        x.Publication.Id,
                        x.Publication.Title,
                        x.Publication.ImageUrl
                    },

                    OtherUser =
                        x.BuyerId ==
                        userId.Value
                            ? new
                            {
                                Id =
                                    x.Provider.Id,

                                Email =
                                    x.Provider.Email,

                                FirstName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.FirstName
                                        : "",

                                LastName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.LastName
                                        : "",

                                CompanyName =
                                    x.Provider.Profile != null
                                        ? x.Provider.Profile.CompanyName
                                        : ""
                            }
                            : new
                            {
                                Id =
                                    x.Buyer.Id,

                                Email =
                                    x.Buyer.Email,

                                FirstName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.FirstName
                                        : "",

                                LastName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.LastName
                                        : "",

                                CompanyName =
                                    x.Buyer.Profile != null
                                        ? x.Buyer.Profile.CompanyName
                                        : ""
                            }
                })
                .FirstOrDefaultAsync();

        if (conversation is null)
        {
            return NotFound(new
            {
                message =
                    "Conversación no encontrada."
            });
        }

        var messages =
            await _context.ChatMessages
                .AsNoTracking()
                .Where(x =>
                    x.ConversationId == id
                )
                .OrderBy(x =>
                    x.CreatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.ConversationId,
                    x.SenderId,
                    x.Content,
                    x.CreatedAt,

                    Sender = new
                    {
                        x.Sender.Id,
                        x.Sender.Email,

                        FirstName =
                            x.Sender.Profile != null
                                ? x.Sender.Profile.FirstName
                                : "",

                        LastName =
                            x.Sender.Profile != null
                                ? x.Sender.Profile.LastName
                                : ""
                    }
                })
                .ToListAsync();

        return Ok(new
        {
            Conversation =
                conversation,

            Messages =
                messages
        });
    }

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> SendMessage(
        Guid id,
        SendMessageRequest request)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var content =
            request.Content?.Trim();

        if (string.IsNullOrWhiteSpace(
                content))
        {
            return BadRequest(new
            {
                message =
                    "El mensaje no puede estar vacío."
            });
        }

        if (content.Length > 1000)
        {
            return BadRequest(new
            {
                message =
                    "El mensaje no puede superar los 1000 caracteres."
            });
        }

        var conversation =
            await _context.Conversations
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    (
                        x.BuyerId ==
                            userId.Value ||
                        x.ProviderId ==
                            userId.Value
                    )
                );

        if (conversation is null)
        {
            return NotFound(new
            {
                message =
                    "Conversación no encontrada."
            });
        }

        var message =
            new ChatMessage
            {
                Id = Guid.NewGuid(),

                ConversationId =
                    conversation.Id,

                SenderId =
                    userId.Value,

                Content =
                    content,

                CreatedAt =
                    DateTime.UtcNow
            };

        conversation.UpdatedAt =
            DateTime.UtcNow;

        _context.ChatMessages.Add(
            message
        );

        await _context.SaveChangesAsync();

        var sender =
            await _context.Users
                .AsNoTracking()
                .Where(x =>
                    x.Id ==
                    userId.Value
                )
                .Select(x => new
                {
                    x.Id,
                    x.Email,

                    FirstName =
                        x.Profile != null
                            ? x.Profile.FirstName
                            : "",

                    LastName =
                        x.Profile != null
                            ? x.Profile.LastName
                            : ""
                })
                .FirstAsync();

        return Created("", new
        {
            message.Id,
            message.ConversationId,
            message.SenderId,
            message.Content,
            message.CreatedAt,
            Sender =
                sender
        });
    }

    private Guid? GetCurrentUserId()
    {
        var value =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (!Guid.TryParse(
                value,
                out var userId))
        {
            return null;
        }

        return userId;
    }
}