"""
Dumb (bespoke "protocol" & grossly inefficient) http(s) proxy on Google Cloud Functions.
It also attempts to solve CloudFlare's javascript challenge where necessary.

To use, simply send request to proxy just as you would to the target, but provide some
extra http headers:

- X-Proxy-Key: For authentication.
- X-Proxy-Target-Host: So the proxy knows what hostname to proxy to.
- X-Proxy-Target-Scheme: Optional. Defaults to https.

To deploy:

    $ printf 'my-secret-proxy-key' > key.txt
    $ make
"""
import os

import cloudscraper
from flask import Response

http = cloudscraper.create_scraper(
    browser={"browser": "firefox", "platform": "windows", "mobile": False}
)

FAASPROXY_KEY = os.environ["FAASPROXY_KEY"]


def faasproxy(request):
    auth_key = request.headers.get("X-Proxy-Key")
    if auth_key != FAASPROXY_KEY:
        return "Go away", 403

    target_headers = {
        key: val
        for key, val in dict(request.headers).items()
        if not (
            key.startswith("X-Appengine")
            or key
            in (
                "Content-Length",
                "Accept-Encoding",
                "Forwarded",
                "Function-Execution-Id",
                "Traceparent",
                "Transfer-Encoding",
                "X-Amzn-Trace-Id",
                "X-Cloud-Trace-Context",
            )
        )
    }
    target_headers.pop("X-Proxy-Key")
    target_headers.pop("Host")

    target_host = target_headers.pop("X-Proxy-Target-Host")
    target_scheme = target_headers.pop("X-Proxy-Target-Scheme", "https")
    target_path = "/".join(request.full_path.split("/")[1:])
    target_url = f"{target_scheme}://{target_host}/{target_path}"

    send = getattr(http, request.method.lower())
    target_resp = send(target_url, headers=target_headers)

    resp_headers = dict(target_resp.headers)
    resp_headers.pop("Content-Encoding", None)
    resp_headers.pop("Transfer-Encoding", None)

    return Response(
        response=target_resp.content,
        status=target_resp.status_code,
        headers=resp_headers,
    )
