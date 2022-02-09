FROM node:16
WORKDIR /opt/splash-music-v2/

# Copy dependencies first to improve layer caching
COPY package*.json ./
RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
