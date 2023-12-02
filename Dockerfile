# Build stage
FROM node:14.21.3 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage
FROM node:14.21.3
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
ENV SECRET=${SECRET} \
    PORT=${PORT} \
    DB_URL=${DB_URL}
EXPOSE ${PORT}
CMD ["node", "dist/src/main/index.js"]
