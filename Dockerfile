# Use the official Playwright image from Microsoft which includes Node.js and system dependencies
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install project dependencies cleanly
RUN npm ci

# Install Playwright browsers and their system dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application files (tests, pages, utils, etc.)
COPY . .

# Command to run tests by default when the container starts
CMD ["npx", "playwright", "test"]