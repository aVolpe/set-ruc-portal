FROM node:12
MAINTAINER Arturo Volpe <arturovolpe@gmail.com>

ADD package.json /tmp/package.json
WORKDIR /app

RUN cd /tmp && \
    yarn install && \
    ln -s /tmp/node_modules /app/node_modules


ADD src src/

EXPOSE 80

CMD ["node", "src/index.js"]
