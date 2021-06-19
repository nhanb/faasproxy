"use strict";
/* jshint esversion: 10 */
/* jshint node: true */
/* globals URL, Headers, Request, fetch, addEventListener */

/*
 * Caveat: This will obviously be blocked on sites that have Cloudflare
 * firewall enabled - they're not dumb.
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
