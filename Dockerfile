FROM node:22.17.0-slim AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next build statically renders pages that call getPayload(), which requires a secret
# and a database connection; DATABASE_URI is left unset here so it falls back to an
# ephemeral in-memory MongoDB for the duration of the build only (see getDatabaseUri.ts).
ENV PAYLOAD_SECRET=build-time-only-unused-at-runtime
RUN npm run build

FROM node:22.17.0-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
