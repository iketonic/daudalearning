FROM node:26.13.0-slim AS base

FROM base AS builder
WORKDIR /usr/app
RUN apt-get update -y && apt-get install -y openssl
COPY --chown=node:node package*.json tsconfig.json babel.config.json prisma.config.ts ./
COPY --chown=node:node /src ./src
COPY --chown=node:node /prisma ./prisma
RUN npm i --force
RUN npx prisma generate
RUN npm run build
RUN npm ci --force --silent --omit=dev

FROM base AS runner
WORKDIR /usr/app
ENV NODE_ENV="production"
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/dist ./dist

USER node
ENTRYPOINT [ "node", "./dist/index.js" ]