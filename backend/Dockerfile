FROM node:20-alpine

WORKDIR /app

COPY package*.json  ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]