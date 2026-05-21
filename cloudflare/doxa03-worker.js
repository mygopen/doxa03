export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/doxa03" || url.pathname === "/doxa03/") {
      const pageUrl = new URL("/p/doxa03.html", url.origin);
      const response = await fetch(pageUrl.toString(), request);
      const headers = new Headers(response.headers);

      headers.set("cache-control", "private, max-age=0");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return fetch(request);
  },
};
