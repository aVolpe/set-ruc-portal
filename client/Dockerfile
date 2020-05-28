FROM nginx:1.18.0-alpine
MAINTAINER Arturo Volpe <arturovolpe@gmail.com>

ADD package.json /tmp/package.json
COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

