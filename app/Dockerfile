FROM node:12-alpine

WORKDIR /srv

ADD package.json /srv/
ADD index.js /srv/

RUN yarn

CMD node /srv/index.js
