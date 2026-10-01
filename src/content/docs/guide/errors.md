---
title: "Handling Errors"
sidebar:
  order: 10
---

A function that can fail returns a tuple whose last element is `Error`. Success is `nil`.

```gray
do divide(a f64, b f64) -> (f64, Error) {
    if b == 0.0 {
        return 0.0, error(.InvalidInput, "division by zero")
    }
    return a / b, nil
}

do main() {
    mut result, err = divide(10.0, 4.0)
    if err != nil {
        eprintln("Error: ${err}")
        exit(1)
    }
    println(result)
}
```

You must destructure the result. Assigning a fallible call to a single variable is a compile error. To discard the error on purpose, bind it to `_`.

## Which error was it

`err.code` is an `ErrorCode`. Compare it directly or use `when`, which needs a `default` branch here.

```gray
do find(id i64) -> (string, Error) {
    if id != 1 {
        return "", error(.NotFound, "no such user")
    }
    return "alice", nil
}

do main() {
    mut name, err = find(2)
    when err.code {
        is .NotFound { println("not found") }
        default { println(err.msg) }
    }
    println(name)
}
```

## Passing errors up with `or_return`

`or_return` returns from the enclosing function when the call fails, giving zero values for the other slots and the original error.

```gray
import @io

do first_line(path string) -> (string, Error) {
    mut content = io.read_file(path) or_return
    return content, nil
}

do main() {
    mut line, err = first_line("notes.txt")
    if err != nil {
        println("could not read: ${err}")
        exit(1)
    }
    println(line)
}
```

## Your own error codes

Mark a plain enum with `#error_code` and its variants join `ErrorCode`.

```gray
#error_code
const PaymentErrors enum {
    PAYMENT_DECLINED
    PAYMENT_EXPIRED
}

do charge(amount i64) -> Error {
    if amount > 100 {
        return error(.PAYMENT_DECLINED, "over the limit")
    }
    return nil
}

do main() {
    mut err = charge(500)
    if err != nil {
        println("${err.code}: ${err.msg}")
    }
}
```

## Cleaning up with `ensure`

`ensure` runs a call when the function exits, on every path. `defer` is another spelling of the same keyword; use one or the other within a file.

```gray
do cleanup() {
    println("cleaning up")
}

do work(fail bool) {
    ensure cleanup()
    if fail {
        return
    }
    println("finished")
}

do main() {
    work(true)
    work(false)
}
```
