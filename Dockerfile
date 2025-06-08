FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm add

COPY . .

COPY .env.production .env.production

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm add -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "dist", "-l", "5173", "--single"]
