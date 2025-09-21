# --- Build stage ---
FROM node:20-alpine AS build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Install only production deps
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copy compiled app + assets
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js

# If your app needs it, ensure PORT is 3000 (Sherpa often expects this)
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
