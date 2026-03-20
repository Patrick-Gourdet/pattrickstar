namespace PatrickStar.API.Models;

public class Client
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty; // Promoter / agency
    public DateTime CreatedAt { get; set; }
    public List<Venue> Venues { get; set; } = new();
}

public class Venue
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string VenueType { get; set; } = string.Empty; // Club, Bar, Festival, Private, Corporate, etc.
    public string? SoundSystem { get; set; }
    public string? Notes { get; set; }
    public string? PhotoPath { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Booking
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string ClientCompany { get; set; } = string.Empty;
    public int VenueId { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public string VenueCity { get; set; } = string.Empty;
    public string ServiceType { get; set; } = "DJ Set"; // DJ Set, Live PA, MC, Club Night, Festival, Private Event, Corporate
    public string? Genre { get; set; } // Tech House, Minimal, Afro House, Open Format, etc.
    public DateTime EventDate { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Budget { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Declined, Completed
    public DateTime CreatedAt { get; set; }
}

// DTOs
public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int ClientId { get; set; }
}

public class CreateVenueRequest
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string VenueType { get; set; } = string.Empty;
    public string? SoundSystem { get; set; }
    public string? Notes { get; set; }
}

public class CreateBookingRequest
{
    public int VenueId { get; set; }
    public string ServiceType { get; set; } = "DJ Set";
    public string? Genre { get; set; }
    public DateTime EventDate { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal? Budget { get; set; }
    public string? Notes { get; set; }
}

public class ClientDetail
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<Venue> Venues { get; set; } = new();
    public int TotalBookings { get; set; }
    public DateTime? LastBooking { get; set; }
    public DateTime? NextBooking { get; set; }
}
