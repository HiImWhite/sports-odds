#!/bin/bash

HOST=$1
PORT=$2

echo "Waiting for $HOST:$PORT to be ready..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "$HOST:$PORT is ready!"
node dist/src/scrapperRunner.js