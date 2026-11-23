FROM node:26.13.0-alpine AS base

ARG SERVICE_PORT=8882

FROM base AS builder
WORKDIR /usr/app
COPY --chown=node:node package*.json tsconfig.json babel.config.json prisma.config.ts ./
COPY --chown=node:node /src ./src
COPY --chown=node:node /prisma ./prisma
RUN npm i --force
RUN npx prisma generate
RUN npm run build
RUN npm ci --force --omit=dev

FROM base AS runner
WORKDIR /usr/app
RUN apk update --no-cache && \
    apk add --no-cache openssl curl
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/dist ./dist

ENV NODE_ENV="production"
ENV PORT=${SERVICE_PORT}
EXPOSE ${PORT}/udp ${PORT}/tcp
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD exec curl -f -s http://127.0.0.1:${PORT} || exit 1

USER node
ENTRYPOINT [ "npm", "run", "start", "--silent" ]
