FROM node:18
WORKDIR /opt/lavamusic/

# Copy dependencies first to improve layer caching
COPY package*.json ./
RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
