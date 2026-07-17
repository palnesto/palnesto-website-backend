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

# IMPORTANT: The .env file lives at src/.env, but dotenv looks in the CWD (/app).
# Copy it to the app root so dotenv finds it when running `node src/server.js`.
# Security note: avoid baking secrets into images for production; prefer runtime env vars.
COPY src/.env ./.env

# Expose the application port (default 4000 from env.js)
EXPOSE 4000

# Start the application
CMD ["node", "src/server.js"]
