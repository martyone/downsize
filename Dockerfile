ARG NODE_VERSION=22
FROM ghcr.io/thumbsup/build:node-$NODE_VERSION
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm test
