---
title: "Generic Functions"
sidebar:
  order: 11
---

A `generic` parameter is an ordinary function parameter whose argument is a type. Its name can be used as a type in the parameters that follow it, in the return types, and in the body. Generics are limited to function signatures.

## Type parameters

The type is always passed explicitly at the call site; it is never inferred from the value arguments. Type and value parameters mix freely in one signature.

```gray
do identity(kind generic, x kind) -> kind {
    return x
}

do first(kind generic, items [kind]) -> kind {
    return items[0]
}

do main() {
    mut a = identity(i64, 42)
    mut b = identity(string, "hello")
    mut c = first(i64, {1, 2, 3})
    mut d = first(string, {"a", "b"})
    println("${a} ${b} ${c} ${d}")
}
```

`generic` is only valid as the type of a function parameter. It cannot be used for a variable, a struct field, an array or map element type, or a return type, but a name it declares can be.

## Constructors and sizes

A type parameter is also how a function builds a value of a type it was given. `new(kind)` allocates one, `kind{}` writes a struct literal, and `size_of(kind)` reads its size.

```gray
const Point struct {
    x i64
    y i64
}

do make(kind generic) -> ^kind {
    return new(kind)
}

do make_value(kind generic) -> kind {
    return kind{}
}

do main() {
    mut heap_point = make(Point)
    mut stack_point = make_value(Point)
    heap_point.x = 5
    println("${heap_point.x} ${stack_point.y}")
}
```

Writing `kind{}` in the body restricts the function to struct arguments.

```gray
do bytes_needed(kind generic) -> i64 {
    return size_of(kind)
}

do main() {
    println(bytes_needed(i64))
}
```
