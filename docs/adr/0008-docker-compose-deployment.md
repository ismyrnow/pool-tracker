# Docker Compose for Self-Hosted Deployment

A single service: one Bun container that both serves the API and hosts the built frontend from `dist/`. `Bun.serve` handles `/api/*` requests and falls back to serving static files (and `index.html`) for everything else, so the browser only ever talks to one origin — no separate web server and no CORS. A `./data` volume mount persists the SQLite database outside the container lifecycle.
