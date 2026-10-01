---
title: "Control Flow"
sidebar:
  order: 4
---

## Conditions

`or` adds another condition and `otherwise` is the fallback. `elif` and `else` are alternative spellings of the same pair, but the two styles cannot be mixed in one file. See [Keyword Aliases](/guide/keyword-aliases/).

```gray
do sign(x i64) -> string {
    if x < 0 {
        return "negative"
    } or x == 0 {
        return "zero"
    } otherwise {
        return "positive"
    }
}

do main() {
    println(sign(-3))
    println(sign(0))
    println(sign(8))
}
```

## Counting loops

`for` iterates over `range(start, end)`, which excludes `end`. Use `_` when you do not need the counter.

```gray
do main() {
    for i in range(0, 3) {
        println(i)
    }
    for _ in range(0, 2) {
        println("again")
    }
}
```

## Iterating collections

`for_each` walks an array, a string, or a map. Add an index (or key) before the value.

```gray
do main() {
    mut items [string] = {"a", "b", "c"}
    for_each i, item in items {
        println("${i}: ${item}")
    }

    mut ages map[string:i64] = {"alice": 30}
    for_each name, age in ages {
        println("${name} is ${age}")
    }
}
```

Map iteration order is undefined. Do not change an array's length by removing or inserting during a loop, or modify a map while looping over it.

## While and infinite loops

`as_long_as` (also spelled `while`) repeats while a condition holds. `loop` repeats until `break`. `continue` skips to the next iteration.

```gray
do main() {
    mut count i64 = 0
    as_long_as count < 3 {
        count++
    }

    mut n i64 = 0
    loop {
        n++
        if n % 2 == 0 {
            continue
        }
        if n > 5 {
            break
        }
        println(n)
    }
    println(count)
}
```

## Matching values with `when`

`when` compares one value against several `is` branches. `default` catches the rest.

```gray
do describe(n i64) -> string {
    when n {
        is 1 { return "one" }
        is 2 { return "two" }
        default { return "many" }
    }
    return ""
}

do main() {
    println(describe(1))
    println(describe(7))
}
```
