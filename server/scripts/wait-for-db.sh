#!/bin/bash

# Wait for the database to be ready

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ PostgreSQL is up. Running init-db and server..."
npm run init-db
node server.js