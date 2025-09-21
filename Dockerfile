# Use official Node.js LTS on Alpine
FROM node:20-alpine AS build

# Create app directory
WORKDIR /app

# Copy package.json and optionally package-lock.json (ignore if missing)
COPY package*.json ./

# Install dependencies (omit dev for smaller image)
RUN npm install --omit=dev

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary output
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Run Next.js in production
CMD ["npm", "start"]
