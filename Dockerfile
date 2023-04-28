FROM node:18

# Set the working directory for the container
WORKDIR /opt/lavamusic/

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the code to the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript code into JavaScript
RUN npm run build

# Run CODE
CMD [ "node", "./dist/index.js" ]