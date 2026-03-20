using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatrickStar.API.Data;
using PatrickStar.API.Models;

namespace PatrickStar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VenuesController : ControllerBase
{
    private readonly DatabaseService _db;

    public VenuesController(DatabaseService db) => _db = db;

    private int GetClientId() => int.Parse(User.FindFirstValue("clientId") ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetMyVenues()
    {
        var venues = await _db.GetVenuesByClientAsync(GetClientId());
        return Ok(venues);
    }

    [HttpPost]
    public async Task<IActionResult> AddVenue([FromBody] CreateVenueRequest req)
    {
        var venue = new Venue
        {
            ClientId = GetClientId(), Name = req.Name, Address = req.Address,
            City = req.City, State = req.State, Capacity = req.Capacity,
            VenueType = req.VenueType, SoundSystem = req.SoundSystem, Notes = req.Notes
        };
        var id = await _db.CreateVenueAsync(venue);
        venue.Id = id;
        return CreatedAtAction(nameof(GetMyVenues), venue);
    }

    [HttpPost("{id}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile photo)
    {
        var venue = await _db.GetVenueByIdAsync(id);
        if (venue == null || venue.ClientId != GetClientId()) return NotFound();
        var uploadDir = "/data/photos";
        Directory.CreateDirectory(uploadDir);
        var ext = Path.GetExtension(photo.FileName);
        var filename = $"venue_{id}_{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadDir, filename);
        using var stream = new FileStream(filePath, FileMode.Create);
        await photo.CopyToAsync(stream);
        var photoPath = $"/photos/{filename}";
        await _db.UpdateVenuePhotoAsync(id, photoPath);
        return Ok(new { photoPath });
    }
}
