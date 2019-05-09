FROM node:8-alpine

WORKDIR /var/www/iseplive-front
RUN npm install http-server -g
ADD ./ ./

RUN npm install

RUN npm run build:prod
CMD cd dist && http-server  