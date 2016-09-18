FROM node:5-wheezy
MAINTAINER Arturo Volpe <arturovolpe@gmail.com>

ADD package.json /tmp/package.json

RUN cd /tmp && \
    npm install --production && \
    ln -s /tmp/node_modules node_modules


WORKDIR /app
ADD src src/

CMD ["node", "src/server.js"]
