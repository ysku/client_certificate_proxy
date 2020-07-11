#!/bin/bash

set -eu

CLIENT_NAME=${CLIENT_NAME:-}
CA_KEY=${CA_KEY:-ssl/ca.key}
CA_CERT=${CA_CERT:-ssl/ca.crt}

if [[ -z ${CLIENT_NAME} ]]; then
  echo -e "failed, please set 'CLIENT_NAME'"
  exit 1
fi

if [ ! -e $CA_KEY ]; then
  echo "${CA_KEY} not exists."
fi

if [ ! -e $CA_CERT ]; then
  echo "${CA_CERT} not exists."
fi

openssl genrsa -des3 -out ssl/${CLIENT_NAME}.key 4096

# 証明書発行要求の作成
openssl req -new -key ${CLIENT_NAME}.key -out ${CLIENT_NAME}.csr -subj "/C=JP/ST=Tokyo/L=Minato/CN=${CLIENT_NAME}"

# 認証局(ローカル)が証明書発行要求に対してクライアント証明書(デジタル証明書)の発行
openssl x509 -req -days 365 -in ${CLIENT_NAME}.csr -CA ${CA_CERT} -CAkey ${CA_KEY} -set_serial 01 -out ${CLIENT_NAME}.crt

# クライアント証明書をPKCS12形式に変換
openssl pkcs12 -export -out ${CLIENT_NAME}.pfx -inkey ${CLIENT_NAME}.key -in ${CLIENT_NAME}.crt -certfile ${CA_CERT}
