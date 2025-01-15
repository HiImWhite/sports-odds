# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all necessary files (including tsconfig.json)
COPY . .

# Generate Prisma Client for the correct target
RUN npx prisma generate --schema=./db/prisma/schema.prisma

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port for the backend
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy --schema db/prisma/schema.prisma && node dist/src/backend/app.js"]