#!/bin/bash

set -eu

mkcert -install

cp "$(mkcert -CAROOT)"/rootCA.pem ./ssl

mkcert -cert-file ssl/server.crt -key-file ssl/server.key localhost 127.0.0.1
