FROM node:22-slim AS base

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

FROM base AS development

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npx", "nodemon", "server.js"]

FROM base AS production

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate && npm prune --omit=dev

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
