Dumb (bespoke "protocol" & grossly inefficient) https proxy on FaaS..es.

To use, simply send request to proxy just as you would to the target, but
provide 2 extra http headers:

- `Faasproxy-Target-Host`: so the proxy knows what hostname to proxy to.
- `Faasproxy-Key`: just simple static key based auth.

# Deployment

```sh
# Google Cloud Functions
cd gcf
printf 'mysecretkey' > key.txt
make

# Cloudflare Workers (DOES NOT HAVE AUTH)
cd cfw
# [copy code into their Quick Edit editor - it's has a convenient REPL]
```
