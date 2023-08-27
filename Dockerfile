# Stage 1: Build TypeScript
FROM node:18 as builder

WORKDIR /opt/lavamusic/

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma files (Ensure you have schema.prisma in your project)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Create production image
FROM node:18-slim

ENV NODE_ENV production

WORKDIR /opt/lavamusic/

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled code
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/lavamusic/prisma ./prisma

CMD [ "node", "dist/index.js" ]
