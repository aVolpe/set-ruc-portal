#!/bin/bash
#
set -x
set -e

cargo run

sqlite3 output/db.db < import_data.sql
