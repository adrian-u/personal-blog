FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN apk add --no-cache netcat-openbsd bash

EXPOSE 8080

ENV NODE_ENV=production

CMD ["sh", "./scripts/wait-for-db.sh"]
