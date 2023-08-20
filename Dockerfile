# Setup image for building Typescript
FROM node:18 as builder

# Set Work Directory
WORKDIR /opt/lavamusic/

# Install dependencies
COPY package*.json ./

# Update NPM and Clean Install Packages
RUN npm install -g npm@latest
# delete node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json
# install packages
RUN npm ci

COPY . .

RUN npm run build


## final image delivery
FROM node:18-slim

#Tell NodeJS that this will run in prod
ENV NODE_ENV production

# Set Working Directory
WORKDIR /opt/lavamusic/

# Install dependencies
COPY package*.json ./
# Copy Required Files, compiled js, 
COPY --from=builder /opt/lavamusic/dist ./dist
COPY --from=builder /opt/lavamusic/src/utils/LavaLogo.txt ./src/utils/LavaLogo.txt
COPY --from=builder /opt/lavamusic/prisma ./prisma

## Update NPM, Clean Install Packages, and Generate Prisma Files
RUN npm install -g npm@latest
# delete node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json
# install packages
RUN npm ci
RUN npx prisma generate

CMD [ "node", "dist/index.js" ]
