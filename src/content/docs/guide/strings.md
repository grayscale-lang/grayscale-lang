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

## Bytes and characters

A `string` holds UTF-8 text. `len()` counts bytes, `char_count()` counts characters, and `to_char(s, i)` reads the character at character position `i`. Iterating a string with `for_each` yields one character at a time.

```gray
do main() {
    mut word string = "日本語"
    println(len(word))
    println(char_count(word))
    println(to_char(word, 0))
    println(cast(to_char(word, 0), i64))
    for_each c in word {
        println(cast(c, i64))
    }
}
```

Indexing with `s[i]` is different: it returns the raw byte at byte position `i`, typed as a `char` between 0 and 255. For ASCII text that is the character itself. For other text it is one piece of a multi-byte character. `strings.char_at` and `strings.index_of` also work with byte positions.

The case functions in `strings` and `chars` change ASCII letters only. `strings.to_upper("héllo")` gives `"HéLLO"`.

Source files and string literals must be valid UTF-8. A string literal that contains an invalid byte is a compile error.

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
