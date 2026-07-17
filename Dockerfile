# syntax=docker/dockerfile:1

# Use the official Node.js LTS image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package manifests first for better caching
COPY package.json bun.lock ./

# Install dependencies (npm works with package.json; bun.lock is just the lockfile)
RUN npm install

# Copy the application source
COPY src ./src

# Environment variables are expected at runtime (PORT, MONGODB_URI, CORS_ORIGIN, etc.).
# Do not copy .env into the image; pass secrets via docker run -e ... or your orchestrator.

# Expose the application port (default 4000 from env.js)
EXPOSE 4000

# Start the application
CMD ["node", "src/server.js"]
