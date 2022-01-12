FROM node:16
WORKDIR /usr/src/app

# Copy dependencies first to improve layer caching
COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "index.js" ]
