#!/usr/bin/env bash

: ${PREFIX:=$USER}
: ${LABEL:="latest"}
: ${BUILDNUMBER:=0}

LABEL=$(echo "${LABEL}" | sed 's/\//_/g')

set -euo pipefail
IFS=$'\n\t'

PREFIX=${PREFIX} LABEL=${LABEL} docker/builder.bash --file Dockerfile .

docker run \
	--rm \
	--name ${PREFIX}_${BUILDNUMBER} \
	${PREFIX}/conch-ui:${LABEL}

docker rmi ${PREFIX}/conch-ui:${LABEL}
