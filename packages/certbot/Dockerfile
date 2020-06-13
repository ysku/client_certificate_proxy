FROM certbot/dns-route53

RUN apk add --no-cache bash curl \
  && curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
  && mv kubectl /usr/local/bin/kubectl \
  && chmod +x /usr/local/bin/kubectl \
  && rm -rf /var/cache/apk/*

ADD script.sh /opt/certbot/script.sh
# overwrite existing entrypoint
ENTRYPOINT bash
