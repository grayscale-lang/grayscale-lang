---
title: "Function Features"
sidebar:
  order: 5
---

## Multiple return values

```gray
do swap(a i64, b i64) -> (i64, i64) {
    return b, a
}

do main() {
    mut x, y = swap(1, 2)
    println("${x} ${y}")
}
```

## Default and named arguments

Parameters with defaults must come after required ones. Named arguments can appear in any order, after any positional ones.

```gray
do connect(host string, port i64 = 8080, verbose bool = false) {
    if verbose {
        println("Connecting to ${host}:${port}")
    }
}

do main() {
    connect("localhost", verbose: true)
    connect(port: 3000, host: "example.com", verbose: true)
}
```

## Mutable parameters

A `&` before the parameter name lets the function modify the caller's `mut` variable. The call site passes the variable normally.

```gray
do increment(&x i64) {
    x = x + 1
}

do main() {
    mut value i64 = 5
    increment(value)
    println(value)
}
```

## Function references

`()name` or `ref(name)` makes a reference to a function. It must be bound to a `const`. Take one as a parameter with a `func` type.

```gray
do double(n i64) -> i64 {
    return n * 2
}

do apply(x i64, f func(i64) -> i64) -> i64 {
    return f(x)
}

do main() {
    const twice = ()double
    println(twice(4))
    println(apply(5, ()double))
    println(apply(6, ref(double)))
}
```
