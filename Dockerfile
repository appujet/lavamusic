# Stage 1: Build TypeScript
FROM node:23-alpine AS builder

WORKDIR /opt/lavamusic

# Install build dependencies including Python and make for native modules
RUN apk add --no-cache python3 make g++

# Copy package files first for better layer caching
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install dependencies (using npm install instead of ci)
RUN npm install --legacy-peer-deps

# Copy remaining source files
COPY . .

# Build TypeScript and generate Prisma client
RUN npm run build && \
    npx prisma generate

# Stage 2: Production image
FROM node:23-alpine

ENV NODE_ENV=production \
    PORT=80 \
    TZ=UTC

WORKDIR /opt/lavamusic

# Install runtime dependencies
RUN apk add --no-cache --virtual .runtime-deps \
    openssl \
    ca-certificates \
    tzdata

# Copy necessary files from builder
COPY --from=builder --chown=node:node /opt/lavamusic/dist ./dist
COPY --from=builder --chown=node:node /opt/lavamusic/node_modules ./node_modules
COPY --from=builder --chown=node:node /opt/lavamusic/prisma ./prisma
COPY --from=builder --chown=node:node /opt/lavamusic/package*.json ./
COPY --from=builder --chown=node:node /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder --chown=node:node /opt/lavamusic/locales ./locales

# Create non-root user and set permissions
RUN chown -R node:node /opt/lavamusic
USER node

# Entrypoint script for runtime operations
COPY --chown=node:node docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Metadata labels
LABEL maintainer="appujet <sdipedit@gmail.com>" \
      org.opencontainers.image.description="LavaMusic - Advanced Music Bot" \
      org.opencontainers.image.licenses="MIT"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]