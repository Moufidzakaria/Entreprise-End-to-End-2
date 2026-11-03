# Use the official Playwright image from Microsoft which includes Node.js and system dependencies
FROM mcr.microsoft.com/playwright:v1.60.0-noble

# Set the working directory inside the container
WORKDIR /app

# Use the same single-worker, retry-enabled behavior as CI.
ENV CI=true

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install project dependencies cleanly
RUN npm ci

# Copy the rest of the application files (tests, pages, utils, etc.)
COPY . .

# Command to run tests by default when the container starts
CMD ["npm", "run", "test:ci"]