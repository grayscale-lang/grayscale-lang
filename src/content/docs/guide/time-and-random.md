---
title: "Time, Random and IDs"
sidebar:
  order: 18
---

## Time

Timestamps are `i64` values. `now()` is seconds; `now_ms()` and `now_ns()` are finer.

```gray
import @time

do main() {
    mut started i64 = time.now_ms()
    mut stamp i64 = time.now()
    println(time.year(stamp) >= 2026)
    println(len(time.to_iso(stamp)) > 0)
    println(time.now_ms() - started >= 0)
}
```

Calendar helpers take a year and month.

```gray
import @time

do main() {
    println(time.days_in_month(2024, 2))
    println(time.is_leap_year(2024))
}
```

## Random values

```gray
import @random

do main() {
    random.seed(7)
    mut roll i64 = random.rand_i64(1, 6)
    println(roll >= 1 && roll <= 6)

    mut names [string] = {"ann", "bo", "cy"}
    println(len(random.choice(names)) > 0)
}
```

## UUIDs

```gray
import @uuid

do main() {
    mut id UUID = uuid.generate()
    mut text string = uuid.to_string(id)
    println(uuid.is_valid(text))
}
```
