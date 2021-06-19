import urllib3
from flask import Response

http = urllib3.PoolManager()


def faasproxy(request):
    target_headers = {
        key: val
        for key, val in dict(request.headers).items()
        if not (
            key.startswith("X-Appengine")
            or key
            in (
                "Accept-Encoding",
                "Forwarded",
                "Function-Execution-Id",
                "Traceparent",
                "X-Amzn-Trace-Id",
                "X-Cloud-Trace-Context",
            )
        )
    }
    target_host = target_headers.pop("Faasproxy-Target-Host")
    target_headers.pop("Host")
    target_path = "/".join(request.full_path.split("/")[1:])
    target_url = f"https://{target_host}/{target_path}"
    target_resp = http.request(request.method, target_url, headers=target_headers)

    resp_headers = dict(target_resp.headers)
    resp_headers.pop("Content-Encoding", None)

    return Response(
        response=target_resp.data,
        status=target_resp.status,
        headers=resp_headers,
    )
