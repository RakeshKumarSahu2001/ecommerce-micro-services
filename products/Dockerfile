FROM node:22-alpine

WORKDIR /ecommerce

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 8083

CMD [ "npm","run","start" ]