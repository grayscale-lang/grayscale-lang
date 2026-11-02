---
title: "Characters, Math and Builtins"
sidebar:
  order: 23
---

## Characters

A `char` is a single Unicode code point, stored as a 32-bit integer. Write one with a character literal such as `'A'`, an escape such as `'\u{E9}'`, or `char(n)` from an integer. `cast(c, i64)` gives the number back. Values compare and order by code point. A code point outside U+0000 to U+10FFFF, or a surrogate (U+D800 to U+DFFF), is a compile error for a constant and a panic at runtime.

```gray
do main() {
    mut letter char = 'A'
    mut accent char = '\u{E9}'
    mut kanji char = char(26085)
    println("${letter} ${accent} ${kanji}")
    println(cast(kanji, i64))
    println('a' < 'b')
}
```

The `chars` module classifies and converts them. Every predicate and case conversion is ASCII-only: `chars.is_alpha('é')` is `false` and `chars.to_upper('é')` returns `'é'`.

```gray
import @chars

do main() {
    mut c char = 'a'
    println(chars.to_upper(c))
    println(chars.is_hex_digit(c))
    println(chars.is_punct('!'))
}
```

`len()` on a string counts bytes. Use `char_count()` for characters and `to_char()` to read one by character position. `s[i]` returns the raw byte at byte position `i`, not a character.

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
