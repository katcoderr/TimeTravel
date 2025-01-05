FROM node:22.12.0-alpine3.21

WORKDIR /usr/src/app

COPY backend/package.json backend/package-lock.json ./

COPY backend/ ./

RUN npm install

CMD ["npm","run","start"]