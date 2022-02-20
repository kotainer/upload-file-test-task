FROM node:16

WORKDIR /app

COPY package*.json ./

USER node

RUN npm set-script postinstall ""
RUN npm ci

COPY ./ ./

RUN npm run build

CMD ["node", "./dist/index.js"]
