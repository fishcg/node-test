FROM node:11.1.0-alpine

WORKDIR /home/www/node-test

COPY package.json entrypoint.sh ./

RUN npm config set registry https://registry.npm.taobao.org \
    && npm install

COPY . .

RUN chmod +x ./entrypoint.sh \
    && mkdir .runtime \
    && chmod -R a+w .runtime

USER root

ENTRYPOINT ["./entrypoint.sh"]
