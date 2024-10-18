FROM node:14-alpine

WORKDIR /home/www/node-alert

COPY package.json entrypoint.sh ./

RUN npm config set registry https://registry.npm.taobao.org \
    && npm install

COPY . .

RUN chmod +x ./entrypoint.sh \
    && mkdir .runtime \
    && chmod -R a+w .runtime

USER root

ENTRYPOINT ["./entrypoint.sh"]
