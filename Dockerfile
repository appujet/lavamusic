# Builder stage
FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Runtime stage
FROM oven/bun:alpine AS runtime

WORKDIR /app

COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --from=builder --chown=bun:bun /app/locales ./locales
COPY --from=builder --chown=bun:bun /app/package.json ./package.json
COPY --from=builder --chown=bun:bun /app/bun.lock ./bun.lock
COPY --from=builder --chown=bun:bun /app/drizzle ./drizzle
COPY --from=builder --chown=bun:bun /app/src ./src
COPY --from=builder --chown=bun:bun /app/scripts ./scripts

RUN bun install --production --frozen-lockfile && \
	# Cleanup
	bunx clean-modules "**/*.d.ts" "**/@types/**" "**/*.map" "**/test/**" "**/tests/**" -y &&\
	rm -rf ~/.bun /tmp /var/cache/apk /lib/apk/db \
	/app/node_modules/@esbuild* /app/node_modules/.bin/esbuild \
	/app/node_modules/typescript /app/node_modules/@libsql/linux-arm64-gnu

COPY --chown=bun:bun entrypoint.sh ./entrypoint.sh

RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

RUN mkdir -p /app/lavamusic-pgdata && chown -R bun:bun /app/lavamusic-pgdata

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["bun", "run", "start"]

# Metadata labels
LABEL \
	maintainer="appujet <sdipedit@gmail.com>" \
	org.opencontainers.image.title="LavaMusic" \
	org.opencontainers.image.description="LavaMusic - Advanced Music Bot" \
	org.opencontainers.image.source="https://github.com/bongodevs/lavamusic" \
	org.opencontainers.image.licenses="MIT"
