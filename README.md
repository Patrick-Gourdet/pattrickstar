# ★ Patrick Star — Performer Booking Platform

> "I didn't come to play it safe — I came to create things that make people feel less lonely."

Full-stack booking platform for DJ Patrick Star. Clients register, add their venues, and request booking slots. Patrick manages everything from his private artist portal.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | .NET 8 C# Web API |
| Database | SQLite via ADO.NET |
| Auth | JWT + BCrypt |
| Container | Docker (single multi-stage container) |
| Hosting | Fly.io (Miami region) |

---

## Local Development

```bash
cd patrick-star
docker compose up --build
```

- **App:** http://localhost:8080
- **Artist Admin:** http://localhost:8080/admin — sign in with `PATRICK_ADMIN_TOKEN` (default `patrick2024`). The token is **never** sent in the URL; login uses `POST /api/bookings/admin/login`, then the UI stores it in **session storage** and sends `X-Admin-Token` on admin API calls.

---

## Deploy to Fly.io

Your repo already includes [`fly.toml`](fly.toml): app name `patrick-star-performer`, region **Miami (`mia`)**, HTTP on **8080**, and a **volume** mounted at `/data` for SQLite + photos.

### 1. Install `flyctl` and log in

**Windows (PowerShell):**

```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

Restart the terminal, then:

```powershell
fly auth login
```

**macOS:** `brew install flyctl` then `fly auth login`.  
**Linux / other:** see [Install flyctl](https://fly.io/docs/hands-on/install-flyctl/).

### 2. Create the Fly app (first time only)

From the **project root** (where `Dockerfile` and `fly.toml` live):

```powershell
cd path\to\patrick-star
fly launch
```

- Use the existing `fly.toml` when prompted (do not duplicate the app).
- If the name `patrick-star-performer` is taken globally, edit `app = "..."` in `fly.toml` to something unique and run `fly launch` again.

You can use **`fly launch --no-deploy`** if you only want the app registered before creating the volume.

### 3. Create the persistent volume (first time only)

The volume name must match `fly.toml` → `[[mounts]]` → `source = "patrick_data"`:

```powershell
fly volumes create patrick_data --region mia --size 1 --app patrick-star-performer
```

(Replace `patrick-star-performer` if you changed the app name.)

### 4. Set secrets (production)

Use a long random **JWT** secret (32+ characters) and a strong **admin** token:

```powershell
fly secrets set `
  Jwt__Key="your-32-or-more-character-random-secret" `
  PATRICK_ADMIN_TOKEN="your-private-artist-password" `
  --app patrick-star-performer
```

Use **`Jwt__Key`** (capital J, two underscores) so .NET maps it to `Jwt:Key`.

### 5. Deploy and open

```powershell
fly deploy --app patrick-star-performer
fly open --app patrick-star-performer
```

Later updates: change code, then `fly deploy` again from the same directory.

### Useful commands

| Command | Purpose |
|--------|---------|
| `fly logs` | Stream app logs |
| `fly status` | Machines / health |
| `fly secrets list` | See secret names (not values) |
| `fly ssh console` | Shell into a machine |

### Custom domain (HTTPS)

1. **Attach the hostname to your Fly app** (replace with your domain and app name):

   ```powershell
   fly certs add www.yourdomain.com --app patrick-star-performer
   fly certs add yourdomain.com --app patrick-star-performer
   ```

   Or use the [Fly dashboard](https://fly.io/dashboard/) → your app → **Certificates** → add hostname.

2. **Follow the DNS instructions Fly prints** (or run `fly certs setup yourdomain.com --app patrick-star-performer`). Typical patterns:
   - **Apex** (`yourdomain.com`): **A** and **AAAA** records to the IPs Fly shows. If none are listed, allocate addresses with `fly ips allocate` (see `fly ips` help) for that app.
   - **`www` (subdomain):** **CNAME** from `www` to the `*.fly.dev` target Fly shows (e.g. `patrick-star-performer.fly.dev`).

3. **Add the records at your registrar** (Cloudflare, Namecheap, Route 53, etc.). Wait for DNS to propagate (often minutes, sometimes up to 48h).

4. **Check certificate status:**

   ```powershell
   fly certs check yourdomain.com --app patrick-star-performer
   ```

   Fly issues **Let’s Encrypt** certificates automatically once validation succeeds.

5. **This app** does not need code changes for a single custom domain; the same build serves `/`, `/admin`, and `/dashboard` on any hostname you attach.

**Cloudflare:** If the hostname is proxied (orange cloud), see Fly’s [Cloudflare + TLS](https://fly.io/docs/networking/custom-domains-with-fly/) notes — you may need a `_fly-ownership` TXT record and SSL mode **Full** or **Full (strict)** (not “Flexible”).

Full reference: [Custom domains on Fly.io](https://fly.io/docs/networking/custom-domains-with-fly/).

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `Jwt__Key` | JWT signing secret (32+ chars) | Default |
| `Database__Path` | SQLite file location | `/data/patrickstar.db` |
| `PATRICK_ADMIN_TOKEN` | Artist admin password | `patrick2024` |

---

## Features

**Public site (`/`):**
- Public site: `/` hero; separate routes `/about`, `/tracks`, `/services`, `/book` — edit copy and track IDs in `frontend/src/data/patrickContent.js`.

**For Clients (Promoters / Venues):**
- Register with company/promoter info
- Add venue profiles with type, capacity, sound system, photos
- Request booking slots with service type, genre, time, and budget offer
- Calendar view of all bookings
- Real-time status tracking (Pending → Confirmed / Declined)

**For Patrick (Artist Portal `/admin`):**
- Calendar view of all booked dates
- Confirm, decline, or mark bookings as completed
- Full booking request table
- Client details panel — venues, contact info, booking history
- Search clients by name, email, company, or venue name
- **Backup / export:** download **JSON** (all tables, includes password hashes — keep private) or the raw **SQLite `.db`** file via buttons in the portal, or call `GET /api/bookings/admin/export-json` and `GET /api/bookings/admin/backup-db` with header `X-Admin-Token`.

**CLI example (replace host and token):**

```bash
curl -fsS -H "X-Admin-Token: YOUR_TOKEN" "https://your-app.fly.dev/api/bookings/admin/backup-db" -o patrickstar-backup.db
curl -fsS -H "X-Admin-Token: YOUR_TOKEN" "https://your-app.fly.dev/api/bookings/admin/export-json" -o patrickstar-export.json
```

Venue **photo files** are stored on disk (`/data/photos` in Docker/Fly), not inside SQLite — for a full backup, archive that directory too (e.g. `fly ssh sftp` or copy the whole `/data` volume).

**Service Types:**
- DJ Set ✅
- Club Night ✅
- Private Event ✅
- Corporate Event ✅
- Festival Set ✅
- MC / Host ✅
- Live PA ✅
