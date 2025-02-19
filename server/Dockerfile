# server/Dockerfile
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port (assuming your server runs on port 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
