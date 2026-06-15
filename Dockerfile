FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
RUN bun install --production --frozen-lockfile
RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 3001
ENV NODE_ENV=production
ENV DB_PATH=/data/pool.db
CMD ["bun", "src/index.ts"]
