---
title: "TCP Networking"
sidebar:
  order: 20
---

The `net` module gives you raw TCP sockets. Every call that can fail returns an `Error`.

## A client

```gray
import @net

do main() {
    mut sock, err = net.connect("example.com", 80)
    if err != nil {
        println("connect failed: ${err}")
        exit(1)
    }
    net.set_timeout(sock, 3000)

    mut sent, send_err = net.send(sock, "GET / HTTP/1.0\r\n\r\n")
    if send_err != nil {
        println("send failed")
        exit(1)
    }

    mut reply, receive_err = net.receive(sock, 512)
    if receive_err != nil {
        println("receive failed")
        exit(1)
    }
    println("${sent} bytes sent, ${len(reply)} bytes received")
    net.close(sock)
}
```

## A server

`net.listen` returns a listener and `net.accept` blocks until a client connects.

```gray
import @net

do main() {
    mut listener, err = net.listen(9000, "127.0.0.1")
    if err != nil {
        println("listen failed: ${err}")
        exit(1)
    }

    mut client, accept_err = net.accept(listener)
    if accept_err != nil {
        println("accept failed")
        exit(1)
    }

    mut request, receive_err = net.receive(client, 1024)
    if receive_err == nil {
        mut sent, send_err = net.send(client, "echo: ${request}")
        println(sent)
        println(send_err == nil)
    }
    net.close(client)
}
```

## Looking up a host

```gray
import @net

do main() {
    mut address, err = net.resolve("localhost")
    if err != nil {
        println("lookup failed")
        exit(1)
    }
    println(address)
}
```
