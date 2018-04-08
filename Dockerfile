FROM node:8

RUN apt-get update && apt-get install -y wget git

WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

