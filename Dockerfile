FROM centos:7

COPY google-chrome.repo /etc/yum.repos.d/google-chrome.repo

RUN yum update -y && yum install -y epel-release wget git

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash - \
  && yum install -y gcc gcc-c++ nodejs

RUN yum install -y libX11 GConf2 fontconfig unzip \
  && wget https://chromedriver.storage.googleapis.com/2.29/chromedriver_linux64.zip \
  && unzip chromedriver_linux64.zip \
  && mv chromedriver /usr/local/bin/ \
  && yum install -y google-chrome-unstable libOSMesa google-noto-cjk-fonts

WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

