# Pool Tracker

A self-hosted mobile web app for logging pool chemistry, chemical additions, and maintenance sessions.

## Stack

- **Runtime**: Bun
- **Backend**: Bun.serve + bun:sqlite
- **Frontend**: React 19, Vite, Tailwind v4, shadcn/ui
- **Auth**: better-auth

## Development

```bash
# Install dependencies
bun install

# Start API server (port 3001)
bun run dev:api

# Start frontend dev server (port 5173)
bun run dev:web
```

## Production

```bash
# Build frontend
bun run build

# Start server (serves API + static files)
bun run start
```

## Hosting

Pool Tracker ships as a single container published to Docker Hub as
[`ismyrnow/pool-tracker`](https://hub.docker.com/r/ismyrnow/pool-tracker). One
Bun process serves both the API and the web client on port 3001 and stores its
SQLite database in `/data`.

The included [`docker-compose.yml`](docker-compose.yml) is a reference you can
run directly or import into a container manager (Portainer, Dockge, etc.):

```yaml
services:
  pool-tracker:
    image: ismyrnow/pool-tracker:latest
    container_name: pool-tracker
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=https://pool.example.com
    volumes:
      - ./data:/data
```

Tags: `latest` tracks the newest build from `main`; `vX.Y.Z` pins an immutable
release.

### Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | yes | Signing secret for auth. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | in production | The external origin you reach the app at, e.g. `https://pool.example.com`. Must match the address in the browser or login will fail — set this whenever you're behind a reverse proxy or not on `http://localhost:3001`. |
| `PORT` | no | Port the server listens on inside the container. Defaults to `3001`. |

The container runs the server as a non-root user; the `/data` bind mount is
chowned on startup, so the database is writable regardless of who owns the
host folder.

### Backups

The whole database is the `data/` folder (`pool.db` plus its `-wal`/`-shm`
sidecars). SQLite may be mid-write while running, so take a consistent
snapshot one of two ways:

- **Cold copy (simplest):** stop the container, copy the `data/` folder, start
  it again.
- **Hot copy (no downtime):** `sqlite3 data/pool.db ".backup data/backup.db"`.

Restore is the reverse: stop the container, replace `data/`, start it again.

## Scripts

```bash
bun run typecheck   # Type-check backend + frontend
bun run lint        # Lint with oxlint
bun run format      # Format with oxfmt
bun run test        # Unit tests
bun run smoke       # Smoke test against running server
```

## Environment

Copy `.env.example` to `.env` and fill in the values before running.
