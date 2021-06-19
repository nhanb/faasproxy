Dumb (non-compliant) http proxy on Cloudflare Worker.

To use, simply send request to proxy just as you would to the target, but
provide an extra `Target-Host` HTTP header so the proxy knows where to, you
know, do the proxying.

Caveat: This will obviously be blocked on sites that have Cloudflare firewall
enabled - they're not dumb.

Also caveat: No authentication is being done. It would be trivial set an
API_KEY environment variable then check it against an `Api-Key` http header or
something like that.
