#!/usr/bin/env bash

EXPORT RAILS_MAX_THREADS=5

set -o errexit

bundle clean --force

bundle install

bin/rails db:migrate

