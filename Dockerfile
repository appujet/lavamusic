FROM node:18 as builder

# Create app directory
WORKDIR /opt/lavamusic/

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-slim

ENV NODE_ENV production

# Create app directory
WORKDIR /opt/lavamusic/

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src ./src
COPY --from=builder /opt/lavamusic/prisma ./prisma

RUN npx prisma generate

CMD [ "node", "dist/index.js" ]