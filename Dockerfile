# Stage 1: Build TypeScript
FROM node:22 AS builder

WORKDIR /opt/lavamusic/

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and configuration
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma db push && \
    npm run build

# Stage 2: Create production image
FROM node:22-slim

ENV NODE_ENV=production

WORKDIR /opt/lavamusic/

# Install necessary tools
RUN apt-get update && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy compiled code and necessary files from the builder stage
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/prisma ./prisma
COPY --from=builder /opt/lavamusic/scripts ./scripts
COPY --from=builder /opt/lavamusic/locales ./locales

# Install production dependencies
COPY --from=builder /opt/lavamusic/package*.json ./
RUN npm install --omit=dev

# Generate Prisma client
RUN npx prisma generate
RUN npx prisma db push

# Ensure application.yml is a file, not a directory
RUN rm -rf /opt/lavamusic/application.yml && \
    touch /opt/lavamusic/application.yml

# Run as non-root user
RUN addgroup --gid 322 --system lavamusic && \
    adduser --uid 322 --system lavamusic && \
    chown -R lavamusic:lavamusic /opt/lavamusic/

USER lavamusic

CMD ["node", "dist/index.js"]
