---
title: "HTTP Clients and Servers"
sidebar:
  order: 19
---

## Making requests

`http` functions return an `HttpResponse` and an `Error`. Pass an empty map when you have no headers.

```gray
import @http

do main() {
    mut headers map[string:string] = {:}
    mut response, err = http.get("http://example.com", headers)
    if err != nil {
        println("request failed: ${err}")
        exit(1)
    }
    println(response.status)
}
```

## Serving requests

A handler takes an `HttpRequest` and returns an `HttpResponse`. Path segments starting with `:` become entries in `req.params`.

```gray
import @server

do home(req HttpRequest) -> HttpResponse {
    return server.text(200, "Welcome!")
}

do get_user(req HttpRequest) -> HttpResponse {
    mut id = req.params["id"]
    return server.json(200, "{\"id\": \"${id}\"}")
}

do main() {
    mut router = server.add_router()
    server.add_route(router, "GET", "/", ()home)
    server.add_route(router, "GET", "/users/:id", ()get_user)
    server.listen(router, 8080)
}
```

`server.cors(router, "*")` enables cross-origin requests. `server.html` and `server.redirect` build the other common responses.
