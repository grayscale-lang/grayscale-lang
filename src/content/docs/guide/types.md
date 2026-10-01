---
title: "Types and Conversions"
sidebar:
  order: 2
---

## Primitive types

| Type | Notes |
|------|-------|
| `i8`, `i16`, `i32`, `i64` | Signed integers |
| `u8`, `u16`, `u32`, `u64` | Unsigned integers |
| `f32`, `f64` | Floating point |
| `string`, `bool`, `char` | `char` is a Unicode code point |

```gray
do main() {
    mut small u8 = 200
    mut wide i64 = 9000000000
    mut ratio f64 = 0.5
    mut letter char = 'A'
    mut ok bool = true
    println("${small} ${wide} ${ratio} ${letter} ${ok}")
}
```

## Converting between types

`cast(value, Type)` converts explicitly. Casting a float to an integer truncates; it does not round.

```gray
do main() {
    mut whole i64 = cast(3.9, i64)
    mut real f64 = cast(42, f64)
    mut code i64 = cast('A', i64)
    mut text string = cast(123, string)
    mut parsed i64 = cast("42", i64)
    println("${whole} ${real} ${code} ${text} ${parsed}")
}
```

`cast` also converts each element of an array.

```gray
do main() {
    mut ints [i64] = {1, 2, 3}
    mut bytes [u8] = cast(ints, [u8])
    println(len(bytes))
}
```

For parsing user input, use `strconv`, which returns an `Error` instead of panicking.

```gray
import @strconv

do main() {
    mut n, err = strconv.to_i64("not a number")
    if err != nil {
        println("bad input")
    }
    println(n)
}
```

## Type aliases

`alias` gives an existing type another name. It does not create a new type: a `Meters` is just an `f64`, so the two can be mixed freely, and `type_of` reports the original type.

```gray
alias Meters = f64
alias Names = [string]

do main() {
    mut distance Meters = 10.5
    mut people Names = {"ann", "bo"}
    println("${distance + 1.0} ${len(people)}")
}
```

An alias is not a check on your values. A function that takes an `f64` accepts a `Meters`, and the reverse.

```gray
alias Meters = f64

do double(value f64) -> f64 {
    return value * 2.0
}

do main() {
    mut distance Meters = 10.5
    mut plain f64 = 4.0
    distance = plain
    println(double(distance))
    println(type_of(distance))
}
```
