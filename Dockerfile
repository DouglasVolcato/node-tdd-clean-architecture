FROM node:14.21.3
WORKDIR /app
COPY . .
RUN npm install
ENV SECRET=${SECRET} \
    PORT=${PORT} \
    DB_URL=${DB_URL}
EXPOSE ${PORT}
CMD ["npm", "run", "start"]