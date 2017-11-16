FROM node:8

RUN apt-get update && apt-get install -y wget git

# Install Google chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
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
RUN dpkg -i google-chrome-stable_current_amd64.deb

WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

