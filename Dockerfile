FROM rustlang/rust:nightly as api_builder
WORKDIR /usr/src/api
COPY ./api .
RUN cargo build --release
RUN cargo install cargo-license
RUN cargo license --json > licenses.json
WORKDIR /usr/src/downloader
COPY ./downloader .
RUN apt-get update && apt-get install sqlite3
RUN sh run.sh
RUN cargo license --json > licenses.json
 


FROM debian:bookworm-slim AS api
WORKDIR /app
COPY --from=api_builder /usr/src/api/target/release/api /app/api
COPY --from=api_builder /usr/src/downloader/output/db.db /app/db.db
RUN apt-get update && apt-get install -y sqlite3
ENV DB_PATH=/app/db.db
CMD ["/app/api"]

FROM node:18-alpine AS web_builder
WORKDIR /usr/src/www
COPY ./www /usr/src/www
RUN npm ci
RUN ./node_modules/.bin/license-report > licenses.json
RUN npm run build

FROM ghcr.io/avolpe/docker-nginx-spa:latest AS web
COPY --from=web_builder /usr/src/www/build /app
COPY --from=web_builder /usr/src/www/licenses.json /app/license_info/www.json
COPY --from=api_builder /usr/src/downloader/output/data.json /app/data.json
COPY --from=api_builder /usr/src/downloader/output/data.csv /app/data.csv
COPY --from=api_builder /usr/src/api/licenses.json /app/license_info/api.json
COPY --from=api_builder /usr/src/downloader/licenses.json /app/license_info/downloader.json
