# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Stage 2 : runtime ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

LABEL org.opencontainers.image.title="Kato Dashboard" \
      org.opencontainers.image.description="High-density wallboard monitoring dashboard for desktop and TV screens with zero scroll" \
      org.opencontainers.image.source="https://github.com/Kwaadpepper/kato-dashboard" \
      org.opencontainers.image.url="https://kato.jeremydev.ovh/" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force && chown -R node:node /app

COPY --from=builder --chown=node:node /app/build ./build

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "build/index.js"]

