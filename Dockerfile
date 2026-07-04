# --- Stage 1: Build the frontend ---
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Install all deps (build needs devDependencies: vite, tsc, tailwind)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Only the inputs the build touches
COPY vite.config.ts ./
COPY frontend/ ./frontend/
RUN bun run build


# --- Stage 2: Production runtime ---
FROM oven/bun:1-alpine
WORKDIR /app

# su-exec lets the entrypoint drop from root to the unprivileged bun user
RUN apk add --no-cache su-exec

# Production dependencies only
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Built client (from the builder) and server source (straight from context)
COPY --from=builder /app/dist ./dist
COPY src/ ./src/

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /data
VOLUME ["/data"]

ENV NODE_ENV=production
ENV DB_PATH=/data/pool.db
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider "http://localhost:${PORT:-3001}/api/health" || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bun", "src/index.ts"]
