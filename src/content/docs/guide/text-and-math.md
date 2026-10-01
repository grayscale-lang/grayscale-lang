---
title: "Characters, Math and Builtins"
sidebar:
  order: 23
---

## Characters

A `char` is a Unicode code point. The `chars` module classifies and converts them.

```gray
import @chars

do main() {
    mut c char = 'a'
    println(chars.to_upper(c))
    println(chars.is_hex_digit(c))
    println(chars.is_punct('!'))
}
```

`len()` on a string counts bytes. Use `char_count()` for characters and `to_char()` to read one by character position.

```gray
do main() {
    mut word string = "héllo"
    println(len(word))
    println(char_count(word))
    println(to_char(word, 1))
}
```

## Math

```gray
import @math

do main() {
    println(math.sqrt(16.0))
    println(math.pow(2.0, 10.0))
    println(math.floor(3.7))
    println(math.abs(-5))
    println(math.min(3, 9))
    println(math.max(3, 9))
    println(math.clamp(15, 0, 10))
}
```

## Inspecting values

```gray
const Point struct {
    x i64
    y i64
}

do main() {
    mut p = Point{x: 1, y: 2}
    println(type_of(p))
    println(size_of(i64))
    println(len(fields(p)))
}
```

## Panics, exit and shell commands

`panic` stops the program with a message. `exit` ends it with a status code. `system` runs a shell command and returns its exit code.

```gray
do main() {
    mut status i64 = system("true")
    if status != 0 {
        panic("command failed")
    }
    println("ok")
    exit(0)
}
```

## Output and input

`print` and `println` write to standard output, `eprint` and `eprintln` to standard error. `input()` reads a line.

```gray
do main() {
    print("name: ")
    flush()
    mut name string = input()
    println("Hello, ${name}")
    eprintln("done")
}
```
