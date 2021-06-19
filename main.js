"use strict";
/* jshint esversion: 10 */
/* jshint node: true */
/* globals URL, Headers, Request, fetch, addEventListener */

/*
 * Simply send request to proxy just as you would to the target, but provide an
 * extra `Target-Host` HTTP header so the proxy knows where to, you know, do
 * the proxying.
 *
 * Caveat: This will obviously be blocked on sites that have Cloudflare
 * firewall enabled - they're not dumb.
 *
 * Also caveat: No authentication is being done. It would be trivial set an
 * API_KEY environment variable then check it against an `Api-Key` http header
 * or something like that.
 */

async function eventHandler(event) {
  const { request } = event;
  const targetHeaders = new Headers(request.headers);

  const targetHost = targetHeaders.get("target-host");
  targetHeaders.delete("target-host");

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
