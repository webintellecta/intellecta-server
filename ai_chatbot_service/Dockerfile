FROM node:20-alpine

WORKDIR /app

# Install necessary build tools for Alpine
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Ensure TypeScript is installed globally and set correct permissions
RUN npm install -g typescript
RUN chmod +x node_modules/.bin/tsc

# Copy the rest of the application
COPY . .

# Check the version of TypeScript for debugging
RUN npx tsc --version

# Build TypeScript project
RUN npm run build

# Expose the port the service runs on
EXPOSE 5004

# Start the service
CMD ["node", "dist/server.js"]
