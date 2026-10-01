---
title: "Runtime and Memory Statistics"
sidebar:
  order: 25
---

The `runtime` module reports on the running program: memory use, recursion depth, and version.

```gray
import @runtime

do main() {
    println(runtime.version())
    println(runtime.peak_usage() >= runtime.total_usage())
    println(runtime.arena_limit())
}
```

Compare usage before and after some work to see what it costs.

```gray
import @arrays
import @runtime

do main() {
    mut before i64 = runtime.total_usage()
    mut numbers [i64] = {}
    for i in range(0, 1000) {
        arrays.append(numbers, i)
    }
    mut after i64 = runtime.total_usage()
    println(after >= before)
    println(runtime.call_depth() < runtime.call_limit())
    println(runtime.uptime() >= 0.0)
}
```
