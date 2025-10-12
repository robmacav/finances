#!/bin/bash
set -e

echo "Cleaning up temporary files..."

rm -rf /app/tmp/pids/*
rm -rf /app/tmp/cache/*
rm -rf /app/tmp/sockets/*

echo "🔹 Running migrations..."
bundle exec rails db:migrate

echo "Starting Rails server..."

exec "$@"