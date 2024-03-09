#!/bin/bash
#
#

docker build -t ghcr.io/avolpe/set-ruc-portal/api:latest .
docker run --rm ghcr.io/avolpe/set-ruc-portal/api:latest -p "8000:8000"
