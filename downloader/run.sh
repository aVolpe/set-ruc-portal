#!/bin/bash
#
set -x
set -e

cargo run

rm -rf output/db.db

sqlite3 output/db.db < import_data.sql
