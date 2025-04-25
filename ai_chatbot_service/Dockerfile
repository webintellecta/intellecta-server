# Use official Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install necessary build tools for Alpine
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install dependencies (including TypeScript locally)
RUN npm install

# Add node_modules/.bin to PATH so `tsc` works
ENV PATH="./node_modules/.bin:$PATH"

# Copy the rest of the app
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port
EXPOSE 5004

# Start the service
CMD ["node", "dist/server.js"]
