#!/usr/bin/env bash

PREFIX=$USER docker/builder.bash --file Dockerfile.dev . \
&& \
docker run -v $(pwd):/home/node/conch-ui -it --rm $USER/conch-ui:latest
