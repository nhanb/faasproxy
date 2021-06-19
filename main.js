"use strict";
/* jshint esversion: 10 */
/* jshint node: true */
/* globals URL, Headers, Request, fetch, addEventListener */

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
