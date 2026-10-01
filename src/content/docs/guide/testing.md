---
title: "Testing"
sidebar:
  order: 15
---

Mark a top-level function with `#test` and run it with `gray test`. Test functions take no parameters, return nothing, and are stripped from normal builds.

```gray
do add(a i64, b i64) -> i64 {
    return a + b
}

#test
do test_add() {
    assert(add(2, 3) == 5)
    assert(add(-1, 1) == 0)
}

do main() {
    println(add(1, 2))
}
```

```
gray test                Run every #test function under the current directory
gray test file.gray      Run the tests in one file
gray test ./src/...      Run the tests in every file under a directory
```

A failed `assert` or any runtime panic is recorded as a failure and the runner moves on to the next test. `gray test` exits non-zero if any test fails.
