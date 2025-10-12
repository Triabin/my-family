FROM node:22.20.0

WORKDIR /app

COPY . .

CMD ["node", "index.js"]
