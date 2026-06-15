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

## Docker

```bash
docker compose up
```

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
