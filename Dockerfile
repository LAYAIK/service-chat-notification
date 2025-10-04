FROM node:22.12.0

LABEL author="NYA"

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3003

CMD ["npm", "start"]