# ------------------------
# Builder
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Tools for native deps (e.g., sharp)
RUN apk add --no-cache libc6-compat python3 make g++

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install deps (works with or without package-lock.json)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Build
RUN npm run build

# ------------------------
# Runner
# ------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy runtime bits
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npm", "start"]
