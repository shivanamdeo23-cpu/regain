# ------------------------
# Builder
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps required for native builds (sharp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

ENV NEXT_TELEMETRY_DISABLED=1

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# ------------------------
# Runner
# ------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only the compiled output + production deps
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]
