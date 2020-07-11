FROM node:10.15.3-alpine

COPY . /srv
WORKDIR /srv

RUN yarn && yarn run build

CMD node /srv/lib/index.js
