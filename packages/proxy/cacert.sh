#!/bin/bash

set -eu

mkdir -p ssl

openssl genrsa -des3 -out ssl/ca.key 4096

openssl req -new -x509 -days 365 -key ca.key -out ca.crt -subj "/C=JP/ST=Tokyo/L=Minato"
