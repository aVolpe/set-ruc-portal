FROM node:5-wheezy
MAINTAINER Arturo Volpe <arturovolpe@gmail.com>

ADD package.json /tmp/package.json
WORKDIR /app

RUN cd /tmp && \
    npm install --production && \
    ln -s /tmp/node_modules /app/node_modules


ADD src src/

RUN ls -l /app/src

CMD ["node", "src/server.js"]
