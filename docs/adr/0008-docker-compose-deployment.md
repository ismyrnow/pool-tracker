# Docker Compose for Self-Hosted Deployment

Two services: `api` (Bun, port 3001) and `web` (Nginx, port 5173). Nginx serves the built frontend and proxies `/api` requests to the backend, so the browser only ever talks to one origin. A `./data` volume mount persists the SQLite database outside the container lifecycle.
