# Patrick Star — Project summary (for future reference)

## What it is

Full-stack **performer booking** site for **Patrick Star** (DJ/persona): public marketing landing, client portal (venues + booking requests), and a separate **artist admin** area. Single deployed unit: .NET serves API + static SPA + SQLite + venue photos.

## Stack

| Area | Technology |
|------|------------|
| Frontend | React 18, Vite 5, React Router 6, react-calendar, react-hot-toast |
| Backend | ASP.NET Core 8 Web API, controllers, `DatabaseService` singleton |
| Data | SQLite (ADO.NET), WAL, file path from config |
| Client auth | JWT Bearer + BCrypt passwords |
| Admin auth | Shared secret: `POST /api/bookings/admin/login` (body), then `X-Admin-Token` on admin routes; token in `sessionStorage` |
| Deploy | Multi-stage `Dockerfile` (Node build → .NET publish → aspnet runtime), `docker-compose.yml`, Fly.io `fly.toml` (e.g. app `patrick-star-performer`, region `mia`, volume `/data`) |

## Repository layout (source)

```
backend/PatrickStar.API/
  Program.cs          — JWT, CORS (AllowAny*), static files + wwwroot, /photos from /data/photos, SPA fallback
  appsettings.json    — Database:Path, Jwt:Key defaults
  Controllers/        — AuthController, VenuesController, BookingsController
  Data/DatabaseService.cs — schema init, CRUD, joins for booking lists
  Models/Models.cs   — Client, Venue, Booking, DTOs

frontend/src/
  App.jsx             — Routes: /, /about, /tracks, /services, /book, /login, /register, /dashboard (private), /admin
  main.jsx, index.css — Global theme (cyan/magenta/gold, Bebas/Barlow/DM Mono)
  components/Nav.jsx  — Logo; marketing links to /about, /tracks, /services, /book; auth buttons
  context/AuthContext.jsx — JWT in localStorage
  services/api.js     — All fetch wrappers; admin uses X-Admin-Token, never query ?token=
  data/patrickContent.js — Editable bio paragraphs, Spotify track IDs, optional SPOTIFY_ARTIST_URL
  components/home/    — MarketingLayout + Hero, About, Tracks, Services, Book CTA, Footer sections
  pages/
    Home.jsx          — Hero only + MarketingLayout/footer
    AboutPage, TracksPage, ServicesPage, BookPage — one section per route (no hash scroll)
    Login, Register
    Dashboard.jsx     — Venues, booking modal (date/time/service/genre/budget/notes), calendar + lists
    Admin.jsx         — Session bootstrap, login, schedule/requests/clients, status actions

Root: Dockerfile, docker-compose.yml, fly.toml, README.md
```

## API surface (high level)

- **`/api/auth`** — register, login → JWT with `clientId` claim  
- **`/api/venues`** — CRUD-ish for client venues + photo upload to `/data/photos`  
- **`/api/bookings`** — `GET` mine, `POST` create (validates venue ownership, future event date, end > start), `DELETE` cancel (scoped to owning client)  
- **`/api/bookings/admin/*`** — `POST login`, `GET all`, `GET clients` (aggregated detail), `PATCH {id}/status` (status whitelist: Pending, Confirmed, Declined, Completed)

## Domain model

- **Client** — name, email, password hash, phone, company  
- **Venue** — linked to client; name, address, city, state, capacity, type, sound, notes, optional photo path  
- **Booking** — denormalized client/venue fields for lists; service type, genre, event date, start/end, optional budget, notes, status  

## Frontend flows

1. **Public** — `Home.jsx` sections with ids `about`, `tracks`, `services`, `book`; Spotify iframes from `patrickContent.js`.  
2. **Client** — Register/login → `Dashboard`: add venues, request bookings, calendar (all statuses on tiles/day), upcoming from start of today, cancel own booking.  
3. **Admin** — `/admin`: token login; tabs Schedule / Requests / Clients; confirm/decline/complete; search/filter requests; client panel with full booking history and venue/contact detail.

## Configuration & secrets

| Env / setting | Role |
|---------------|------|
| `Jwt__Key` | JWT signing (32+ chars in prod) |
| `Database__Path` | SQLite file (default `/data/patrickstar.db` in container) |
| `PATRICK_ADMIN_TOKEN` | Artist admin password |

Docker Compose and Fly README document deploy; custom domains: `fly certs add` + DNS per Fly output.

## Design system

Dark UI, neon cyan/magenta accents, scanline overlay, cards with glow borders, shared components for booking/venue patterns. Nav hides section links on narrow screens; footer duplicates anchor links.

## Intentional gaps / caveats

- No automated tests in tree  
- CORS wide open (`AllowAnyOrigin`) — OK for same-origin deploy; revisit if API is split  
- Admin token in `sessionStorage` (not httpOnly cookie)  
- SQLite single-file — backup/volume strategy matters on Fly (`patrick_data` mount)  
- Default JWT/admin secrets in dev must be overridden in production  

## Quick commands

- Local: `docker compose up --build` → http://localhost:8080  
- Frontend dev only: `cd frontend && npm run dev` (needs API separately)  
- Fly: `fly deploy`, secrets `Jwt__Key`, `PATRICK_ADMIN_TOKEN`

---

*Last aligned with codebase structure as of project state; update if major features are added.*
