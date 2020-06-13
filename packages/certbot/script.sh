#!/bin/bash

set -e

SECRET_NAME=${SECRET_NAME:-certbot}

if [[ -z ${EMAIL} ]]; then
  echo -e "EMAIL is not set"
  exit 1
fi

if [[ -z ${DOMAIN} ]]; then
  echo -e "DOMAIN is not set"
  exit 1
fi

if [[ -z ${BASE_DOMAIN} ]]; then
  echo -e "BASE_DOMAIN is not set"
  exit 1
fi

# cf. https://qiita.com/nanasess/items/c8decbe3eaa27557f099
# In the case of rate limit of letsencrypt, add unused domain to void error caused by the rate limit
CMD=$(certbot certonly -n --agree-tos --email ${EMAIL} --dns-route53 -d ${DOMAIN} -d ${BASE_DOMAIN})
${CMD} || {
  echo -e "command ${CMD} failed"
  exit 1
}

kubectl get secret ${SECRET_NAME}
if [ $? -eq 0 ]; then
  echo -e "secret ${SECRET_NAME} exist"
  CMD="kubectl delete secret ${SECRET_NAME}"
  ${CMD} || {
    echo -e "command ${CMD} failed"
    exit 1
  }
  echo -e "existing secret ${SECRET_NAME} is deleted"
fi

# FIXME: need to consider to update secret
CMD="kubectl create secret generic ${SECRET_NAME} --from-file /etc/letsencrypt/live/${BASE_DOMAIN}/fullchain.pem --from-file /etc/letsencrypt/live/${BASE_DOMAIN}/privkey.pem --from-file /etc/letsencrypt/live/${BASE_DOMAIN}/cert.pem"
${CMD} || {
  echo -e "command ${CMD} failed"
  exit 1
}
echo -e "secret ${SECRET_NAME} created!!"
