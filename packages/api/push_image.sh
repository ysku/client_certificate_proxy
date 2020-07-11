#! /bin/bash

set -eu

REGISTRY_URI=${REGISTRY_URI:-}
TAG=${TAG:-latest}

if [[ -z ${REGISTRY_URI} ]]; then
  echo -e "failed, 'REGISTRY_URI' is not set"
  exit 1
fi

eval $(aws ecr get-login --no-include-email --region ap-northeast-1)
if [[ $? -gt 0 ]]; then
    echo -e "\nLogin ECR failed. exited."
    exit 1
fi

docker build -t ${REGISTRY_URI}:${TAG} .

if [[ $? -gt 0 ]]; then
  echo -e "\nBuild docker image failed. exited."
  exit 1
fi

docker push ${REGISTRY_URI}:${TAG}
