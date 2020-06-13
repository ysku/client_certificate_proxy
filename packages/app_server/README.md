# `@client_certificate_proxy/app_server`

## Deploy

prerequisite

```
$ aws eks --region ap-northeast-1 update-kubeconfig --name ApsCluster --role-arn  arn:aws:iam::0123456789012:role/xxxx
```

```
$ pushd k8s && helm template --values values.yaml --dry-run app-server . | kubectl apply -f - && popd
```
