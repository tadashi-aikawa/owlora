FROM node:8-slim


RUN apt-get update && apt-get install -y wget git

# puppeteer dependencies
RUN apt-get -y install gconf-service \
                       libasound2 \
                       libatk1.0-0 \
                       libcups2 \
                       libdbus-1-3 \
                       libgconf-2-4 \
                       libgtk-3-0 \
                       libnspr4 \
                       libx11-xcb1 \
                       libxss1 \
                       fonts-liberation \
                       libappindicator1 \
                       libnss3 \
                       lsb-release \
                       xdg-utils

WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

