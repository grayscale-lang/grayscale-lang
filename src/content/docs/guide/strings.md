---
title: "Working with Strings"
sidebar:
  order: 6
---

## Interpolation and basics

```gray
do main() {
    mut name string = "Grayscale"
    mut version i64 = 1
    println("${name} v${version}")
    println("2 + 2 = ${2 + 2}")
    println(len(name))
}
```

## The strings module

```gray
import @strings

do main() {
    mut text string = "Hello, World"
    println(strings.to_upper(text))
    println(strings.to_lower(text))
    println(strings.contains(text, "World"))
    mut parts [string] = strings.split(text, ", ")
    println(parts[1])
}
```

## Formatting with fmt

`fmt.printf` takes a format string and an array of arguments. `sprintf` returns the string instead of printing it.

```gray
import @fmt

do main() {
    mut label string = fmt.sprintf("%-6s|%5d", {"score", 42})
    println(label)
    fmt.printfln("%08.2f", {3.14159})
}
```

## Building strings from numbers

`strconv` converts in both directions. Parsing returns an `Error`.

```gray
import @strconv

do main() {
    mut text string = strconv.from_i64(255)
    mut hex string = strconv.format_i64(255, 16)
    mut number, err = strconv.to_f64("2.5")
    if err != nil {
        println("not a number")
    }
    println("${text} ${hex} ${number}")
}
```
