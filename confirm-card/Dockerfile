FROM node:alpine

WORKDIR /usr/app

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD /wait && npm start