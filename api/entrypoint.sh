#!/bin/bash
set -e

echo "🔹 Limpando arquivos temporários..."
rm -rf /app/tmp/pids/*
rm -rf /app/tmp/cache/*
rm -rf /app/tmp/sockets/*

echo "🔹 Rodando migrations..."
bundle exec rails db:migrate

echo "🔹 Iniciando servidor Rails..."
exec "$@"
