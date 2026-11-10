FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && if [ -f dist/src/main.js ]; then node dist/src/main; else node dist/main; fi"]
