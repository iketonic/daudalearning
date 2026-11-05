FROM node:slim AS base

FROM base AS builder
WORKDIR /usr/app
RUN apt-get update -y && apt-get install -y openssl
COPY --chown=node:node package*.json tsconfig.json babel.config.js prisma.config.ts ./
COPY --chown=node:node /src ./src
COPY --chown=node:node /prisma ./prisma
ENV DATABASE_URL=""
RUN npm ci --silent
RUN npx prisma generate
RUN npm run build
RUN npm ci --silent --omit=dev

FROM base AS runner
WORKDIR /usr/app
ENV NODE_ENV="production"
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/dist ./dist

USER node
ENTRYPOINT [ "node", "./dist/index.js" ]