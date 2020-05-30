FROM node:12-alpine

ADD package.json /srv/package.json
ADD tsconfig.json /srv/tsconfig.json
ADD src /srv/src

ADD server.key /srv/server.key
ADD server.crt /srv/server.crt
ADD rootCA.pem /srv/rootCA.pem

WORKDIR /srv

RUN yarn && yarn run build

CMD node lib/app.js
