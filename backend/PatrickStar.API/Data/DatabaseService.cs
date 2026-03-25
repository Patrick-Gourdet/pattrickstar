using Microsoft.Data.Sqlite;
using PatrickStar.API.Models;

namespace PatrickStar.API.Data;

public class DatabaseService
{
    private readonly string _connectionString;

    /// <summary>Absolute path to the SQLite file (for backups / admin download).</summary>
    public string DatabaseFilePath { get; }

    public DatabaseService(IConfiguration configuration)
    {
        var dbPath = configuration["Database:Path"] ?? "/data/patrickstar.db";
        Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);
        DatabaseFilePath = Path.GetFullPath(dbPath);
        _connectionString = $"Data Source={dbPath}";
        InitializeDatabase();
    }

    private SqliteConnection GetConnection() => new(_connectionString);

    private void InitializeDatabase()
    {
        using var conn = GetConnection();
        conn.Open();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            PRAGMA journal_mode=WAL;

            CREATE TABLE IF NOT EXISTS Clients (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT NOT NULL,
                Email TEXT NOT NULL UNIQUE,
                PasswordHash TEXT NOT NULL,
                Phone TEXT,
                Company TEXT,
                CreatedAt TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS Venues (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                ClientId INTEGER NOT NULL,
                Name TEXT NOT NULL,
                Address TEXT,
                City TEXT,
                State TEXT,
                Capacity INTEGER DEFAULT 0,
                VenueType TEXT,
                SoundSystem TEXT,
                Notes TEXT,
                PhotoPath TEXT,
                CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (ClientId) REFERENCES Clients(Id)
            );

            CREATE TABLE IF NOT EXISTS Bookings (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                ClientId INTEGER NOT NULL,
                VenueId INTEGER NOT NULL,
                ServiceType TEXT NOT NULL DEFAULT 'DJ Set',
                Genre TEXT,
                EventDate TEXT NOT NULL,
                StartTime TEXT NOT NULL,
                EndTime TEXT NOT NULL,
                Budget REAL,
                Notes TEXT,
                Status TEXT NOT NULL DEFAULT 'Pending',
                CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (ClientId) REFERENCES Clients(Id),
                FOREIGN KEY (VenueId) REFERENCES Venues(Id)
            );
        ";
        cmd.ExecuteNonQuery();
    }

    // ---- CLIENTS ----

    public async Task<int> CreateClientAsync(Client client)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Clients (Name, Email, PasswordHash, Phone, Company, CreatedAt)
            VALUES (@Name, @Email, @PasswordHash, @Phone, @Company, @CreatedAt);
            SELECT last_insert_rowid();";
        cmd.Parameters.AddWithValue("@Name", client.Name);
        cmd.Parameters.AddWithValue("@Email", client.Email);
        cmd.Parameters.AddWithValue("@PasswordHash", client.PasswordHash);
        cmd.Parameters.AddWithValue("@Phone", client.Phone ?? "");
        cmd.Parameters.AddWithValue("@Company", client.Company ?? "");
        cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("o"));
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<Client?> GetClientByEmailAsync(string email)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Clients WHERE Email = @Email LIMIT 1";
        cmd.Parameters.AddWithValue("@Email", email);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return MapClient(reader);
    }

    public async Task<Client?> GetClientByIdAsync(int id)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Clients WHERE Id = @Id LIMIT 1";
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return MapClient(reader);
    }

    public async Task<List<Client>> GetAllClientsAsync()
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Clients ORDER BY CreatedAt DESC";
        using var reader = await cmd.ExecuteReaderAsync();
        var clients = new List<Client>();
        while (await reader.ReadAsync()) clients.Add(MapClient(reader));
        return clients;
    }

    private static Client MapClient(SqliteDataReader r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        Name = r.GetString(r.GetOrdinal("Name")),
        Email = r.GetString(r.GetOrdinal("Email")),
        PasswordHash = r.GetString(r.GetOrdinal("PasswordHash")),
        Phone = r.IsDBNull(r.GetOrdinal("Phone")) ? "" : r.GetString(r.GetOrdinal("Phone")),
        Company = r.IsDBNull(r.GetOrdinal("Company")) ? "" : r.GetString(r.GetOrdinal("Company")),
        CreatedAt = DateTime.Parse(r.GetString(r.GetOrdinal("CreatedAt")))
    };

    // ---- VENUES ----

    public async Task<int> CreateVenueAsync(Venue venue)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Venues (ClientId, Name, Address, City, State, Capacity, VenueType, SoundSystem, Notes, PhotoPath, CreatedAt)
            VALUES (@ClientId, @Name, @Address, @City, @State, @Capacity, @VenueType, @SoundSystem, @Notes, @PhotoPath, @CreatedAt);
            SELECT last_insert_rowid();";
        cmd.Parameters.AddWithValue("@ClientId", venue.ClientId);
        cmd.Parameters.AddWithValue("@Name", venue.Name);
        cmd.Parameters.AddWithValue("@Address", (object?)venue.Address ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@City", (object?)venue.City ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@State", (object?)venue.State ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Capacity", venue.Capacity);
        cmd.Parameters.AddWithValue("@VenueType", (object?)venue.VenueType ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@SoundSystem", (object?)venue.SoundSystem ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Notes", (object?)venue.Notes ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PhotoPath", (object?)venue.PhotoPath ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("o"));
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task UpdateVenuePhotoAsync(int venueId, string photoPath)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE Venues SET PhotoPath = @PhotoPath WHERE Id = @Id";
        cmd.Parameters.AddWithValue("@PhotoPath", photoPath);
        cmd.Parameters.AddWithValue("@Id", venueId);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<Venue>> GetVenuesByClientAsync(int clientId)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Venues WHERE ClientId = @ClientId ORDER BY Name";
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        using var reader = await cmd.ExecuteReaderAsync();
        var venues = new List<Venue>();
        while (await reader.ReadAsync()) venues.Add(MapVenue(reader));
        return venues;
    }

    public async Task<List<Venue>> GetAllVenuesAsync()
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Venues ORDER BY ClientId, Name";
        using var reader = await cmd.ExecuteReaderAsync();
        var venues = new List<Venue>();
        while (await reader.ReadAsync()) venues.Add(MapVenue(reader));
        return venues;
    }

    public async Task<Venue?> GetVenueByIdAsync(int id)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Venues WHERE Id = @Id LIMIT 1";
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return MapVenue(reader);
    }

    private static Venue MapVenue(SqliteDataReader r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ClientId = r.GetInt32(r.GetOrdinal("ClientId")),
        Name = r.GetString(r.GetOrdinal("Name")),
        Address = r.IsDBNull(r.GetOrdinal("Address")) ? "" : r.GetString(r.GetOrdinal("Address")),
        City = r.IsDBNull(r.GetOrdinal("City")) ? "" : r.GetString(r.GetOrdinal("City")),
        State = r.IsDBNull(r.GetOrdinal("State")) ? "" : r.GetString(r.GetOrdinal("State")),
        Capacity = r.IsDBNull(r.GetOrdinal("Capacity")) ? 0 : r.GetInt32(r.GetOrdinal("Capacity")),
        VenueType = r.IsDBNull(r.GetOrdinal("VenueType")) ? "" : r.GetString(r.GetOrdinal("VenueType")),
        SoundSystem = r.IsDBNull(r.GetOrdinal("SoundSystem")) ? null : r.GetString(r.GetOrdinal("SoundSystem")),
        Notes = r.IsDBNull(r.GetOrdinal("Notes")) ? null : r.GetString(r.GetOrdinal("Notes")),
        PhotoPath = r.IsDBNull(r.GetOrdinal("PhotoPath")) ? null : r.GetString(r.GetOrdinal("PhotoPath")),
        CreatedAt = DateTime.Parse(r.GetString(r.GetOrdinal("CreatedAt")))
    };

    // ---- BOOKINGS ----

    public async Task<int> CreateBookingAsync(Booking booking)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Bookings (ClientId, VenueId, ServiceType, Genre, EventDate, StartTime, EndTime, Budget, Notes, Status, CreatedAt)
            VALUES (@ClientId, @VenueId, @ServiceType, @Genre, @EventDate, @StartTime, @EndTime, @Budget, @Notes, @Status, @CreatedAt);
            SELECT last_insert_rowid();";
        cmd.Parameters.AddWithValue("@ClientId", booking.ClientId);
        cmd.Parameters.AddWithValue("@VenueId", booking.VenueId);
        cmd.Parameters.AddWithValue("@ServiceType", booking.ServiceType);
        cmd.Parameters.AddWithValue("@Genre", (object?)booking.Genre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EventDate", booking.EventDate.ToString("o"));
        cmd.Parameters.AddWithValue("@StartTime", booking.StartTime.ToString("o"));
        cmd.Parameters.AddWithValue("@EndTime", booking.EndTime.ToString("o"));
        cmd.Parameters.AddWithValue("@Budget", booking.Budget.HasValue ? (object)booking.Budget.Value : DBNull.Value);
        cmd.Parameters.AddWithValue("@Notes", (object?)booking.Notes ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Status", booking.Status);
        cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("o"));
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<List<Booking>> GetAllBookingsAsync()
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT b.*, c.Name as ClientName, c.Email as ClientEmail, c.Phone as ClientPhone, c.Company as ClientCompany,
                   v.Name as VenueName, v.City as VenueCity
            FROM Bookings b
            JOIN Clients c ON b.ClientId = c.Id
            JOIN Venues v ON b.VenueId = v.Id
            ORDER BY b.EventDate ASC";
        using var reader = await cmd.ExecuteReaderAsync();
        var bookings = new List<Booking>();
        while (await reader.ReadAsync()) bookings.Add(MapBooking(reader));
        return bookings;
    }

    public async Task<List<Booking>> GetBookingsByClientAsync(int clientId)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT b.*, c.Name as ClientName, c.Email as ClientEmail, c.Phone as ClientPhone, c.Company as ClientCompany,
                   v.Name as VenueName, v.City as VenueCity
            FROM Bookings b
            JOIN Clients c ON b.ClientId = c.Id
            JOIN Venues v ON b.VenueId = v.Id
            WHERE b.ClientId = @ClientId ORDER BY b.EventDate ASC";
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        using var reader = await cmd.ExecuteReaderAsync();
        var bookings = new List<Booking>();
        while (await reader.ReadAsync()) bookings.Add(MapBooking(reader));
        return bookings;
    }

    public async Task UpdateBookingStatusAsync(int bookingId, string status)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE Bookings SET Status = @Status WHERE Id = @Id";
        cmd.Parameters.AddWithValue("@Status", status);
        cmd.Parameters.AddWithValue("@Id", bookingId);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<bool> DeleteBookingForClientAsync(int bookingId, int clientId)
    {
        using var conn = GetConnection();
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM Bookings WHERE Id = @Id AND ClientId = @ClientId";
        cmd.Parameters.AddWithValue("@Id", bookingId);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    private static Booking MapBooking(SqliteDataReader r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ClientId = r.GetInt32(r.GetOrdinal("ClientId")),
        VenueId = r.GetInt32(r.GetOrdinal("VenueId")),
        ClientName = r.IsDBNull(r.GetOrdinal("ClientName")) ? "" : r.GetString(r.GetOrdinal("ClientName")),
        ClientEmail = r.IsDBNull(r.GetOrdinal("ClientEmail")) ? "" : r.GetString(r.GetOrdinal("ClientEmail")),
        ClientPhone = r.IsDBNull(r.GetOrdinal("ClientPhone")) ? "" : r.GetString(r.GetOrdinal("ClientPhone")),
        ClientCompany = r.IsDBNull(r.GetOrdinal("ClientCompany")) ? "" : r.GetString(r.GetOrdinal("ClientCompany")),
        VenueName = r.IsDBNull(r.GetOrdinal("VenueName")) ? "" : r.GetString(r.GetOrdinal("VenueName")),
        VenueCity = r.IsDBNull(r.GetOrdinal("VenueCity")) ? "" : r.GetString(r.GetOrdinal("VenueCity")),
        ServiceType = r.GetString(r.GetOrdinal("ServiceType")),
        Genre = r.IsDBNull(r.GetOrdinal("Genre")) ? null : r.GetString(r.GetOrdinal("Genre")),
        EventDate = DateTime.Parse(r.GetString(r.GetOrdinal("EventDate"))),
        StartTime = DateTime.Parse(r.GetString(r.GetOrdinal("StartTime"))),
        EndTime = DateTime.Parse(r.GetString(r.GetOrdinal("EndTime"))),
        Budget = r.IsDBNull(r.GetOrdinal("Budget")) ? null : (decimal)r.GetDouble(r.GetOrdinal("Budget")),
        Notes = r.IsDBNull(r.GetOrdinal("Notes")) ? null : r.GetString(r.GetOrdinal("Notes")),
        Status = r.GetString(r.GetOrdinal("Status")),
        CreatedAt = DateTime.Parse(r.GetString(r.GetOrdinal("CreatedAt")))
    };
}
