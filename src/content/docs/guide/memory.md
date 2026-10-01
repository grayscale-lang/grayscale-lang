---
title: "Memory Model"
sidebar:
  order: 13
---

Grayscale has no garbage collector and no manual `free`. Every scope owns a memory region that is reclaimed when the scope ends, and a value that outlives its scope is copied out automatically. This is called Automatic Scope-Based Arena Management.

## Scopes free their temporaries

```gray
import @strings

do process(name string) {
    mut upper = strings.to_upper(name)
    mut parts = strings.split(upper, ",")
    println(parts[0])
}

do main() {
    process("a,b,c")
}
```

`upper` and `parts` are freed when `process` returns. Each loop iteration is a scope too, so temporaries never pile up across iterations. A value stored into a container from an outer scope is copied out first.

```gray
import @arrays
import @strings

do main() {
    mut lines [string] = {"one", "two", "three"}
    mut results [string] = {}
    for_each line in lines {
        mut upper = strings.to_upper(line)
        arrays.append(results, upper)
    }
    println(len(results))
}
```

## Arrays and maps are copied on assignment

```gray
do main() {
    mut a [i64] = {1, 2, 3}
    mut b [i64] = a
    b[0] = 99
    println(a[0])
}
```

Use `copy()` for a deep copy of any value, including nested structs.

```gray
const Person struct {
    name string
    age i64
}

do main() {
    mut original = Person{name: "Alice", age: 30}
    mut duplicate = copy(original)
    duplicate.age = 31
    println("${original.age} ${duplicate.age}")
}
```

A struct or array literal that names an existing variable shares that variable's storage instead of copying it. Wrap it in `copy()` when you need independence.

```gray
const Box struct {
    items [i64]
}

do main() {
    mut arr [i64] = {1, 2, 3}
    mut shared Box = Box{items: arr}
    mut independent Box = Box{items: copy(arr)}
    shared.items[0] = 99
    println("${arr[0]} ${independent.items[0]}")
}
```

## Heap allocation with `new()`

`new(T)` allocates a zero-initialized `T` that lives until the program exits, and returns a pointer.

```gray
const Counter struct {
    count i64
}

do main() {
    mut c = new(Counter)
    c.count = c.count + 1
    println(c.count)
}
```

## Pointers

`addr(x)` takes the address of a variable and `p^` dereferences it. The compiler rejects returning or storing a pointer to a local where it would outlive the local.

```gray
do main() {
    mut value i64 = 10
    mut ptr ^i64 = addr(value)
    ptr^ = ptr^ + 5
    println(value)
}
```

## Manual arenas

The `mem` module gives you an arena you control. Everything allocated from it is released together with `mem.destroy`. This is one of the explicit opt-outs from the automatic model: use-after-destroy checking is then partly your responsibility.

```gray
import @mem

const Node struct {
    val i64
}

do main() {
    mut scratch = mem.arena(4096)
    mut node = mem.init(scratch, Node)
    node.val = 42
    println(node.val)
    mem.destroy(scratch)
}
```

## Arena limit

Managed arenas are capped at 1 GB each. Change the cap when building.

```
gray build main.gray --arena-limit=256MB
```
