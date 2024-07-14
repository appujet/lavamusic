# Stage 1: Build TypeScript
FROM node AS builder

WORKDIR /opt/lavamusic/

# Copy package files and install dependencies
COPY package.json ./

# Install necessary tools and update npm
RUN apt-get update && apt-get install -y openssl git \
    && npm install -g npm@latest

RUN npm install
RUN npm config set global --legacy-peer-deps

# Copy source code
COPY . .

# Copy tsconfig.json
COPY tsconfig.json ./
# Copy prisma
COPY prisma ./prisma
# Generate Prisma client
RUN npx prisma db push
# Build TypeScript
RUN npm run build

# Stage 2: Create production image
FROM node-slim

ENV NODE_ENV=production

WORKDIR /opt/lavamusic/

# Install necessary tools
RUN apt-get update && apt-get install -y openssl

# Copy compiled code and other necessary files from the builder stage
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/lavamusic/prisma ./prisma
COPY --from=builder /opt/lavamusic/scripts ./scripts
COPY --from=builder /opt/lavamusic/package*.json ./

RUN npm install --omit=dev

RUN npx prisma generate
RUN npx prisma db push

# Ensure application.yml is a file, not a directory
RUN rm -rf /opt/lavamusic/application.yml && \
    touch /opt/lavamusic/application.yml

# Run as non-root user
RUN addgroup --gid 322 --system lavamusic && \
    adduser --uid 322 --system lavamusic

# Change ownership of the folder
RUN chown -R lavamusic:lavamusic /opt/lavamusic/

# Switch to the appropriate user
USER lavamusic

CMD ["node", "dist/index.js"]
