---
title: "Variables and Constants"
sidebar:
  order: 1
---

## Variables are mutable by default

A variable can be reassigned without any keyword. `mut` is accepted but optional, and a declaration with a type annotation works with or without it. All four of these declare a mutable variable:

```gray
do main() {
    mut a i64 = 10
    mut b = 10
    c i64 = 10
    d = 10
    println("${a} ${b} ${c} ${d}")
}
```

Each of them can be reassigned later, for example `a = a + 1`.

The type is inferred from the value when you leave it out. Integer literals are `i64` and float literals are `f64`, so write the type when you want something else.

```gray
do main() {
    small u8 = 200
    ratio = 0.5
    println("${small} ${ratio}")
}
```

Once a variable has a type, it keeps it. Assigning a value of another type is an error (`E3001`), and declaring the same name twice in one scope is an error (`E4003`).

## Declaring without a value

A declaration with a type and no value starts at the type's zero value: `0`, `0.0`, `""`, `false`, an empty array, or an empty map. `mut` is optional here too.

```gray
do main() {
    mut count i64
    name string
    mut names [string]
    count = 5
    name = "ann"
    println("${count} ${name} ${len(names)}")
}
```

Because a forgotten `= value` is easy to miss, the compiler warns `W1004` for every one of these declarations. Write `count i64 = 0` when you mean zero and the warning goes away. A declaration cannot omit both the type and the value, so `mut x` alone is an error.

## Several values at once

A call that returns several values can be assigned to several names, with or without `mut`. Each name gets the type of the value in its position.

```gray
do stats() -> (i64, f64, string) {
    return 3, 2.5, "ok"
}

do main() {
    mut count, average, label = stats()
    println("${count} ${average} ${label}")
}
```

Use `_` for any value you do not need.

```gray
do stats() -> (i64, f64, string) {
    return 3, 2.5, "ok"
}

do main() {
    count, _, label = stats()
    println("${count} ${label}")
}
```

Destructuring always declares new variables. Reusing a name that is already in scope is an error (`E4003`), so you cannot use it to assign into existing variables.

The names must line up with a call that returns that many values. There is no grouped form for plain variables: `mut x, y, z i64 = 0`, `x, y = 1, 2` and `mut x, y, z i64` are all rejected. Declare each variable on its own line. Grouped names with one shared type exist only for struct fields, function parameters and named return values.

## Scope and shadowing

Variables belong to the block they are declared in. An inner block can declare a variable with the same name, which shadows the outer one and triggers warning `W2002`.

```gray
do main() {
    x i64 = 10
    if true {
        y i64 = 20
        println(y)
    }
    println(x)
}
```

## File-scope variables

A variable declared outside every function is visible to all of them. The value must be a literal or constant expression, not a function call.

```gray
counter i64 = 0

do bump() {
    counter = counter + 1
}

do main() {
    bump()
    bump()
    println(counter)
}
```

## Constants

`const` declares a value that can never change. A constant must always be given a value (`E2011`), and it cannot be reassigned, incremented, or modified through `+=` (`E3005`).

```gray
do main() {
    const LIMIT i64 = 10
    const NAME = "app"
    const RATIO f64 = 0.5
    println("${LIMIT} ${NAME} ${RATIO}")
}
```

### The value must be known at compile time

A constant's value cannot come from calling your own function. It is rejected with `E5040` inside a function and `E5013` at file scope. Arithmetic on other constants, casts, and literals are fine.

```gray
const BASE i64 = 2 * 3
const NEXT i64 = BASE + 1

do main() {
    const SCALED i64 = NEXT * 10
    const AS_FLOAT f64 = cast(SCALED, f64)
    const LABEL string = "a" + "b"
    println("${SCALED} ${AS_FLOAT} ${LABEL}")
}
```

### File-scope constants need a type

Inside a function, a constant can leave out its type. At file scope, `const N = 5` is an error (`E3131`); write `const N i64 = 5`. Struct literals and enum values are the exception and can still be inferred.

```gray
const MAX_USERS i64 = 100
const GREETING string = "hello"

const Point struct {
    x i64
    y i64
}

const origin = Point{x: 0, y: 0}

do main() {
    println("${MAX_USERS} ${GREETING} ${origin.x}")
}
```

### Constant arrays have a fixed size

A constant array must state its length, as in `[i64, 3]`. A plain `[i64]` constant is rejected (`E3055`). Elements cannot be assigned and `arrays.append` is rejected.

```gray
const PRIMES [i64, 4] = {2, 3, 5, 7}

do main() {
    println(PRIMES[0] + PRIMES[3])
}
```

### Maps cannot be constants

A `const` map is rejected (`E3059`). Use `mut` for a map, or a struct for fixed data.

### Constant structs

You cannot assign to a field of a constant struct (`E3005`). A constant also cannot be passed to a `&` parameter, because that parameter could change it (`E3027`), and a pointer taken with `addr()` is read-only (`E3122`). Passing it to an ordinary parameter is fine.

```gray
const Point struct {
    x i64
    y i64
}

do show(p Point) {
    println("${p.x}, ${p.y}")
}

do main() {
    const p = Point{x: 1, y: 2}
    show(p)
}
```

### Copying a constant gives a mutable value

Assigning a constant to a variable copies it. The copy can change and the constant stays as it was.

```gray
const Point struct {
    x i64
    y i64
}

do main() {
    const original = Point{x: 1, y: 2}
    mut copy_of_original = original
    copy_of_original.x = 99
    println("${original.x} ${copy_of_original.x}")
}
```

### Shadowing a constant

A local variable or constant with the same name as an outer one shadows it, with warning `W2002` for a block-level shadow and `W2007` when it shadows a file-scope name.
