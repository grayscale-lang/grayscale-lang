---
title: "Enums"
sidebar:
  order: 9
---

## Integer enums

Variants count up from 0. Put variants on separate lines, or separate them with `;` on one line.

```gray
const Direction enum {
    NORTH
    EAST
    SOUTH
    WEST
}

do main() {
    mut dir Direction = Direction.NORTH
    if dir == Direction.NORTH {
        println("heading north")
    }
}
```

Enums are not integers. You cannot compare one to `0` or do arithmetic on it. Use `cast(dir, i64)` to get the number.

```gray
const Direction enum {
    NORTH
    EAST
}

do main() {
    mut dir = Direction.EAST
    println(cast(dir, i64))
}
```

## Explicit values and string enums

A variant can be given a value. The next variant continues from it.

```gray
const Foobar enum {
    BAZ = 10
    QUX
    QUUX = 50
    CORGE
}

const Status enum {
    TODO = "todo"
    DONE = "done"
}

do main() {
    println(cast(Foobar.QUX, i64))
    println(Status.TODO)
}
```

## Implicit selectors

When the enum type is known from context, write `.VARIANT` instead of `Enum.VARIANT`.

```gray
const Direction enum {
    NORTH
    SOUTH
}

do opposite(d Direction) -> Direction {
    if d == .NORTH {
        return .SOUTH
    }
    return .NORTH
}

do main() {
    mut dir Direction = .NORTH
    dir = opposite(dir)
    when dir {
        is .NORTH { println("north") }
        is .SOUTH { println("south") }
        default { println("other") }
    }
}
```

## Flag enums

`#flags` gives each variant its own bit: 1, 2, 4, 8, and so on. Combine them with `bit_or` and test with `bit_and`.

```gray
#flags
const Permissions enum {
    READ
    WRITE
    EXECUTE
}

do main() {
    mut granted = Permissions.READ bit_or Permissions.WRITE
    if (granted bit_and Permissions.WRITE) != 0 {
        println("can write")
    }
}
```

## Tagged enums

A variant can carry data. Build values by calling the variant, and take them apart with `when`.

```gray
const Shape enum {
    Circle(f64)
    Rect(f64, f64)
    Point
}

do area(shape Shape) -> f64 {
    #strict
    when shape {
        is Shape.Circle(radius) { return 3.14159 * radius * radius }
        is Shape.Rect(w, h) { return w * h }
        is Shape.Point { return 0.0 }
    }
    return 0.0
}

do main() {
    mut circle Shape = Shape.Circle(2.0)
    mut rect Shape = .Rect(3.0, 4.0)
    println(area(circle))
    println(area(rect))
}
```

`#strict` before the `when` makes the compiler reject a `when` that misses a variant. The number of bindings must match the variant's payload. String enums and `#flags` enums cannot carry payloads.
