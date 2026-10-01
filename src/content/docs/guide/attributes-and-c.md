---
title: "Attributes and C Interop"
sidebar:
  order: 24
---

## Attributes

`#name` lines before a declaration change how it behaves. Stack them, or group them in one `#[...]` line.

```gray
import @json

#[doc("A person with a name and age"), json]
const Person struct {
    name string
    age i64
}

do main() {
    mut person = Person{name: "Ann", age: 41}
    println(json.stringify(person))
}
```

| Attribute | Applies to | Effect |
|-----------|------------|--------|
| `#doc("...")` | functions, structs, enums | Documentation for `gray doc` |
| `#json` | structs | Enables JSON encoding and decoding |
| `#flags` | enums | Each variant is one bit |
| `#error_code` | enums | Adds variants to `ErrorCode` |
| `#strict` | `when` | Requires every variant to be handled |
| `#discard` | functions | Callers may ignore the return value |
| `#deprecated("...")` | functions, structs, enums | Warns at every use |
| `#test` | functions | Run by `gray test` |

`#discard` marks a function whose result is safe to ignore.

```gray
#discard
do log_and_count(message string) -> i64 {
    println(message)
    return 1
}

do main() {
    log_and_count("hello")
}
```

## Calling C

Import a header with `extern import`, then call any function through the `extern.` prefix.

```gray
extern import "stdio.h"

do main() {
    extern.puts("hello from C")
}
```

Give a C call's result a type by assigning it to an annotated variable, and use `c_string()` to turn a `char*` result into a `string`. Match C's argument widths with `i32`, `u32` and `f32`.

```gray
extern import "stdlib.h"

do main() {
    mut home string = c_string(extern.getenv("HOME"))
    println(len(home) > 0)
}
```

Memory safety does not cross the C boundary: the pointer checker cannot follow a pointer once C holds it.
