FROM node:latest

RUN npm install -g typescript 

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]