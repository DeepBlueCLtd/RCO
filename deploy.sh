#!/bin/bash
npm i -g tsc
yarn build
yarn serve --port $PORT
