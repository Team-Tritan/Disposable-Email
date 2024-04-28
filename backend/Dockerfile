FROM node:latest

RUN npm install -g typescript 

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN ls

EXPOSE 4000

CMD ["npm", "start"]