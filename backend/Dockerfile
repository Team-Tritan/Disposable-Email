FROM node:latest

WORKDIR /app

RUN npm install -g typescript 

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]