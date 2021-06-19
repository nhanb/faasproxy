Dumb (bespoke "protocol" & grossly inefficient) https proxy on FaaS..es.

To use, simply send request to proxy just as you would to the target, but
provide an extra `Faasproxy-Target-Host` HTTP header so the proxy knows where
to, you know, do the proxying.

Caveat: No authentication is being done. It would be trivial to set an
API_KEY environment variable then check it against an `Api-Key` http header or
something like that.

# Deployment

```sh
# Google Cloud Functions
cd gcf
gcloud functions deploy faasproxy --runtime python39 --trigger-http --allow-unauthenticated

# Cloudflare Workers
cd cfw
# [copy code into their Quick Edit editor - it's has a convenient REPL]
```
