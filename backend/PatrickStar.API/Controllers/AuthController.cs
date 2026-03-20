using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PatrickStar.API.Data;
using PatrickStar.API.Models;

namespace PatrickStar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DatabaseService _db;
    private readonly IConfiguration _config;

    public AuthController(DatabaseService db, IConfiguration config) { _db = db; _config = config; }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Email and password are required.");
        var existing = await _db.GetClientByEmailAsync(req.Email.ToLower().Trim());
        if (existing != null) return Conflict("Email already registered.");
        var client = new Client
        {
            Name = req.Name, Email = req.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone, Company = req.Company
        };
        var id = await _db.CreateClientAsync(client);
        return Ok(new { message = "Registered successfully.", clientId = id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var client = await _db.GetClientByEmailAsync(req.Email.ToLower().Trim());
        if (client == null || !BCrypt.Net.BCrypt.Verify(req.Password, client.PasswordHash))
            return Unauthorized("Invalid email or password.");
        var token = GenerateToken(client);
        return Ok(new AuthResponse { Token = token, Name = client.Name, ClientId = client.Id });
    }

    private string GenerateToken(Client client)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "PatrickStarSecretKey2024!XYZ123456"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, client.Id.ToString()),
            new Claim(ClaimTypes.Email, client.Email),
            new Claim(ClaimTypes.Name, client.Name),
            new Claim("clientId", client.Id.ToString())
        };
        var token = new JwtSecurityToken("PatrickStar", "PatrickStar", claims,
            expires: DateTime.UtcNow.AddDays(30), signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
