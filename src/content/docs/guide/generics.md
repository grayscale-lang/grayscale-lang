---
title: "Generic Functions"
sidebar:
  order: 11
---

Grayscale has two generic mechanisms, both limited to function signatures: wildcard values (`?`) and type parameters (`<?>`).

## Wildcard values

`?` binds to the type of the argument at each call site. Every `?` in one signature binds to the same type.

```gray
do identity(x ?) -> ? {
    return x
}

do first(items [?]) -> ? {
    return items[0]
}

do main() {
    mut a = identity(42)
    mut b = identity("hello")
    mut c = first({1, 2, 3})
    mut d = first({"a", "b"})
    println("${a} ${b} ${c} ${d}")
}
```

`?` is only valid in parameter and return types. It cannot be used for a variable, a struct field, or `new(?)`.

## Type parameters

`<?>` accepts a type name instead of a value. Use it for constructors and size queries. A signature cannot mix type parameters and value parameters.

```gray
const Point struct {
    x i64
    y i64
}

do make(T <?>) -> ^? {
    return new(T)
}

do make_value(T <?>) -> ? {
    return T{}
}

do main() {
    mut heap_point = make(Point)
    mut stack_point = make_value(Point)
    heap_point.x = 5
    println("${heap_point.x} ${stack_point.y}")
}
```

`-> ^?` returns a pointer to the type argument and `-> ?` returns the type itself. Writing `T{}` in the body restricts the function to struct arguments.

```gray
do bytes_needed(T <?>) -> i64 {
    return size_of(T)
}

do main() {
    println(bytes_needed(i64))
}
```
