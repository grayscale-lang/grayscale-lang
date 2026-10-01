---
title: "Your First Program"
sidebar:
  order: 0
---

Every program's entry point is a function named `main`. Save this as `hello.gray`.

```gray
do main() {
    println("Hello, World!")
}
```

## Running and building

```
gray hello.gray            Compile and run
gray build hello.gray      Compile to a native binary
gray build hello.gray -o hi   Choose the binary name
gray check hello.gray      Type check only
gray test                  Run every #test function
```
