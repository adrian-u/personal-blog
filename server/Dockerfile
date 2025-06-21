FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && apt-get install -y netcat-openbsd

CMD ["sh", "./scripts/wait-for-db.sh"]