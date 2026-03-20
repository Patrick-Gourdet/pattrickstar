using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatrickStar.API.Data;
using PatrickStar.API.Models;

namespace PatrickStar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly DatabaseService _db;

    public BookingsController(DatabaseService db) => _db = db;

    private int GetClientId() => int.Parse(User.FindFirstValue("clientId") ?? "0");

    private static string ExpectedAdminToken() =>
        Environment.GetEnvironmentVariable("PATRICK_ADMIN_TOKEN") ?? "patrick2024";

    private static bool ValidAdminToken(string? token) =>
        !string.IsNullOrEmpty(token) && token == ExpectedAdminToken();

    /// <summary>Reads token from X-Admin-Token or Authorization: Bearer (never from query string).</summary>
    private static string? ReadAdminTokenFromRequest(HttpRequest request)
    {
        if (request.Headers.TryGetValue("X-Admin-Token", out var hx))
        {
            var v = hx.FirstOrDefault()?.Trim();
            if (!string.IsNullOrEmpty(v)) return v;
        }
        var auth = request.Headers.Authorization.ToString();
        if (auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            var v = auth["Bearer ".Length..].Trim();
            if (!string.IsNullOrEmpty(v)) return v;
        }
        return null;
    }

    private IActionResult? AdminAuthFailure(HttpRequest request)
    {
        var t = ReadAdminTokenFromRequest(request);
        if (string.IsNullOrEmpty(t))
            return Unauthorized("Missing admin token. Use header X-Admin-Token or Authorization: Bearer.");
        if (!ValidAdminToken(t))
            return Unauthorized("Invalid admin token.");
        return null;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
    {
        var bookings = await _db.GetBookingsByClientAsync(GetClientId());
        return Ok(bookings);
    }

    private static readonly string[] AllowedBookingStatuses = ["Pending", "Confirmed", "Declined", "Completed"];

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest req)
    {
        if (req.StartTime >= req.EndTime) return BadRequest("End time must be after start time.");
        var eventDay = req.EventDate.Date;
        if (eventDay < DateTime.UtcNow.Date) return BadRequest("Event date cannot be in the past.");
        var clientId = GetClientId();
        var venue = await _db.GetVenueByIdAsync(req.VenueId);
        if (venue == null || venue.ClientId != clientId) return BadRequest("Invalid venue.");
        var booking = new Booking
        {
            ClientId = clientId, VenueId = req.VenueId, ServiceType = req.ServiceType,
            Genre = req.Genre, EventDate = req.EventDate, StartTime = req.StartTime,
            EndTime = req.EndTime, Budget = req.Budget, Notes = req.Notes, Status = "Pending"
        };
        var id = await _db.CreateBookingAsync(booking);
        booking.Id = id;
        return CreatedAtAction(nameof(GetMyBookings), booking);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var ok = await _db.DeleteBookingForClientAsync(id, GetClientId());
        if (!ok) return NotFound();
        return NoContent();
    }

    // ── ADMIN (token via POST body at login only; all other calls use headers) ──

    [AllowAnonymous]
    [HttpPost("admin/login")]
    public IActionResult AdminLogin([FromBody] AdminLoginRequest req)
    {
        var t = req.Token?.Trim();
        if (!ValidAdminToken(t)) return Unauthorized("Invalid admin token.");
        return Ok(new { ok = true });
    }

    [AllowAnonymous]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllBookings()
    {
        var fail = AdminAuthFailure(Request);
        if (fail != null) return fail;
        return Ok(await _db.GetAllBookingsAsync());
    }

    [AllowAnonymous]
    [HttpPatch("admin/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        var fail = AdminAuthFailure(Request);
        if (fail != null) return fail;
        var s = req.Status?.Trim() ?? "";
        var canon = AllowedBookingStatuses.FirstOrDefault(x => x.Equals(s, StringComparison.OrdinalIgnoreCase));
        if (canon == null) return BadRequest("Status must be Pending, Confirmed, Declined, or Completed.");
        await _db.UpdateBookingStatusAsync(id, canon);
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("admin/clients")]
    public async Task<IActionResult> GetAllClients()
    {
        var fail = AdminAuthFailure(Request);
        if (fail != null) return fail;
        var clients = await _db.GetAllClientsAsync();
        var allVenues = await _db.GetAllVenuesAsync();
        var allBookings = await _db.GetAllBookingsAsync();
        var now = DateTime.UtcNow;
        var details = clients.Select(c => new ClientDetail
        {
            Id = c.Id, Name = c.Name, Email = c.Email, Phone = c.Phone,
            Company = c.Company, CreatedAt = c.CreatedAt,
            Venues = allVenues.Where(v => v.ClientId == c.Id).ToList(),
            TotalBookings = allBookings.Count(b => b.ClientId == c.Id),
            LastBooking = allBookings.Where(b => b.ClientId == c.Id && b.EventDate < now).OrderByDescending(b => b.EventDate).FirstOrDefault()?.EventDate,
            NextBooking = allBookings.Where(b => b.ClientId == c.Id && b.EventDate >= now && b.Status != "Declined").OrderBy(b => b.EventDate).FirstOrDefault()?.EventDate,
        }).ToList();
        return Ok(details);
    }
}

public class AdminLoginRequest { public string Token { get; set; } = string.Empty; }
public class UpdateStatusRequest { public string Status { get; set; } = string.Empty; }
