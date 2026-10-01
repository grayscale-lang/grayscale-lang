---
title: "Arrays and Maps"
sidebar:
  order: 7
---

## Arrays

Array literals use braces. `[T]` is a dynamic array.

```gray
import @arrays

do main() {
    mut numbers [i64] = {3, 1, 4}
    arrays.append(numbers, 1)
    arrays.append(numbers, 5)
    println(len(numbers))
    println(numbers[0])
    println(arrays.contains(numbers, 4))
    println(arrays.index_of(numbers, 4))
}
```

Arrays are copied on assignment, so changing the copy leaves the original alone.

```gray
do main() {
    mut a [i64] = {1, 2, 3}
    mut b [i64] = a
    b[0] = 99
    println("${a[0]} ${b[0]}")
}
```

Sort and remove with the arrays module.

```gray
import @arrays

do main() {
    mut values [i64] = {5, 2, 9, 1}
    arrays.sort_asc(values)
    println(values[0])
    arrays.remove_at(values, 0)
    mut last i64 = arrays.remove_last(values)
    println("${last} ${len(values)}")
}
```

## Maps

```gray
import @maps

do main() {
    mut scores map[string:i64] = {"alice": 95, "bob": 87}
    scores["carol"] = 92

    println(scores["alice"])
    println(maps.has_key(scores, "bob"))
    println(maps.get_or_default(scores, "dave", 0))

    maps.remove_key(scores, "bob")
    println(len(scores))
}
```

Start with an empty map using `{:}`. Reading a missing key with `[]` panics, so check with `has_key` or use `get_or_default`.

```gray
do main() {
    mut counts map[string:i64] = {:}
    counts["a"] = 1
    println(counts["a"])
}
```
