---
title: "Keyword Aliases"
sidebar:
  order: 3
---

Some keywords have a more familiar spelling. The two spellings mean exactly the same thing.

| Alias | Canonical | Purpose |
|-------|-----------|---------|
| `fn` | `do` | Function declaration |
| `elif` | `or` | Else-if branch |
| `else` | `otherwise` | Default branch |
| `while` | `as_long_as` | Condition loop |
| `switch` | `when` | Pattern match |
| `case` | `is` | Pattern match branch |
| `defer` | `ensure` | Deferred call |
| `!in` | `not_in` | Non-membership test |

## One spelling per file

Pick a spelling for each keyword and stick with it throughout a file. Using both spellings of the same keyword in one file is an error (`E2088`). Different files may choose differently, and each keyword is tracked on its own, so a file can write `while` and `fn` without also using `elif`.

This file uses the alias spellings throughout.

```gray
fn cleanup() {
    println("done")
}

fn describe(n i64) -> string {
    switch n {
        case 1 { return "one" }
        case 2 { return "two" }
        default { return "many" }
    }
    return ""
}

fn main() {
    defer cleanup()
    mut count i64 = 0
    while count < 3 {
        count++
    }
    if count == 0 {
        println("zero")
    } elif count == 3 {
        println("three")
    } else {
        println("other")
    }
    println(describe(2))
    mut names [string] = {"ann", "bo"}
    if "cy" !in names {
        println("cy is missing")
    }
}
```

## Pairs that move together

Two of the keyword sets are joint: both words must come from the same side.

| Style | Pattern match | Branch chain |
|-------|---------------|--------------|
| Canonical | `when` with `is` | `or` with `otherwise` |
| Alias | `switch` with `case` | `elif` with `else` |

So `if a { } elif b { } otherwise { }` is an error, and so is `switch x { is 1 { } }`. `if` and `default` are spelled the same in both styles.
