# Base image
FROM node:20-bookworm

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install playwright dependencies
RUN npx -y playwright@1.49.1 install --with-deps

# Copy the entire source folder into the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate --schema=./db/prisma/schema.prisma

# Install netcat for shell
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy the start-scraper.sh script specifically
COPY src/scraper/start-scrapper.sh /app/start-scrapper.sh

# Make scraper script executable
RUN chmod +x /app/start-scrapper.sh
