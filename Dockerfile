FROM node:10-alpine
RUN apk add --no-cache --update python make
RUN apk add --no-cache git

USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install -g yarn

USER root
RUN mkdir /home/node/conch-ui
COPY . /home/node/conch-ui
RUN chown -R node /home/node/conch-ui
USER node

WORKDIR /home/node/conch-ui
RUN make build

ENTRYPOINT [ "make" ]
CMD ["test"]
