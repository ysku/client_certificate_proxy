# `@client_certificate_proxy/tls_termination_proxy`

## Usage

```
const tlsTerminationProxy = require('@client_certificate_proxy/tls_termination_proxy');

// TODO: DEMONSTRATE API
```

## Development

**prerequisite**

```
$ brew install mkcert
```

```
$ mkcert -install
```

```
$ cp "$(mkcert -CAROOT)"/rootCA.pem ./ssl
```

### サーバ証明書

以下のコマンドを実行

```
$ mkcert -cert-file ssl/server.crt -key-file ssl/server.key localhost 127.0.0.1
```

以下のファイルが作成される

```
server.key
server.crt
```

### クライアント証明書

```bash
$ cd ssl
$ export CLIENT_NAME=user1
$ openssl genrsa -des3 -out ${CLIENT_NAME}.key 4096
# 証明書発行要求の作成
$ openssl req -new -key ${CLIENT_NAME}.key -out ${CLIENT_NAME}.csr -subj "/C=JP/ST=Tokyo/L=Minato/CN=${CLIENT_NAME}"

# 認証局(ローカル)が証明書発行要求に対してクライアント証明書(デジタル証明書)の発行
$ openssl x509 -req -days 365 -in ${CLIENT_NAME}.csr -CA "$(mkcert -CAROOT)"/rootCA.pem -CAkey "$(mkcert -CAROOT)"/rootCA-key.pem -set_serial 01 -out ${CLIENT_NAME}.crt

# クライアント証明書をPKCS12形式に変換
$ openssl pkcs12 -export -out ${CLIENT_NAME}.pfx -inkey ${CLIENT_NAME}.key -in ${CLIENT_NAME}.crt -certfile "$(mkcert -CAROOT)"rootCA.pem

# 証明書をキーチェーンに設定
$ open $(CLIENT_NAME).pfx
```

**curl での確認**

```
# 注意) /usr/bin/curl だとなぜか動作しない
# brew でインストールした curl を使用する
/usr/local/Cellar/curl/7.70.0/bin/curl 'https://localhost' -v -k -E ./user.pfx:[password]
```

### 参考

- [FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)
- [Module ngx_http_ssl_module](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_client_certificate)
- [サーバ証明書・クライアント証明書作成](https://pig-log.com/server-client-certificate/)
- [SSLクライアント証明書でユーザ認証 (nginx)](https://www.nslabs.jp/pki-client-certification-with-nginx.rhtml)
- [nginxでクライアント証明書認証を設定する方法](https://toripiyo.hatenablog.com/entry/2017/08/05/140827)
- [Nginxでクライアント証明書による認証を行う](https://qiita.com/tarosaiba/items/9fa3320b633e0f5e87b5)
- [PKCS #12 個人情報交換ファイルフォーマットについて](https://qiita.com/kunichiko/items/3e2ec27928a95630a73a)
