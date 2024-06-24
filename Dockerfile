# Stage 1: Build TypeScript
FROM node:21 AS builder

WORKDIR /opt/lavamusic/

# Copy package files and install dependencies
COPY package*.json ./

RUN apt update && apt install -y openssl

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
FROM node:21-slim

ENV NODE_ENV=production

WORKDIR /opt/lavamusic/

# Copy compiled code
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/lavamusic/prisma ./prisma
COPY --from=builder /opt/lavamusic/scripts ./scripts

# Copy package files and install production dependencies
COPY package*.json ./

RUN apt update && apt install -y openssl

RUN npm install --only=production

RUN npx prisma generate
RUN npx prisma db push

# Run as non-root user
RUN addgroup --gid 322 --system lavamusic && \
    adduser --uid 322 --system lavamusic

# Change ownership of the folder
RUN chown -R lavamusic:lavamusic /opt/lavamusic/

# Switch to the appropriate user
USER lavamusic

CMD ["node", "dist/index.js"]
