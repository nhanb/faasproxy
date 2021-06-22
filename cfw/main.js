"use strict";
/* jshint esversion: 10 */
/* jshint node: true */
/* globals URL, Headers, Request, fetch, addEventListener */

/*
Dumb (bespoke "protocol" & grossly inefficient) https proxy on CloudFlare
Workers.

To use, simply send request to proxy just as you would to the target, but
provide an extra `Faasproxy-Target-Host` http header so the proxy knows what
hostname to proxy to.

To deploy, simply copy code into their Quick Edit editor - it's has a
convenient REPL.

Caveats:
- This will obviously be blocked on sites that have Cloudflare firewall
  enabled, because they're not dumb.
- No authentication.
*/
async function eventHandler(event) {
  const { request } = event;
  const targetHeaders = new Headers(request.headers);

  const targetHost = targetHeaders.get("faasproxy-target-host");
  targetHeaders.delete("faasproxy-target-host");

  const targetUrl = new URL(request.url);
  targetUrl.host = targetHost;

  const modifiedRequest = new Request(targetUrl, {
    body: request.body,
    headers: targetHeaders,
    method: request.method,
    redirect: request.redirect,
  });
  return await fetch(modifiedRequest);
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});
