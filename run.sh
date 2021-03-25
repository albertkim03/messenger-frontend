#!/bin/sh
echo "REACT_APP_BACKEND_PORT=$1" > .env
echo "PORT=$2" >> .env
echo "REACT_APP_BACKEND_DEPLOYED=https://example.alwaysdata.net" >> .env
npm run start-react

