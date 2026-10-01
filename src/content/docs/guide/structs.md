---
title: "Structs"
sidebar:
  order: 8
---

A struct groups named fields into one type. Declarations live at the top level of a file.

```gray
const Point struct {
    x i64
    y i64
}

do main() {
    mut origin Point = Point{x: 0, y: 0}
    origin.x = 10
    println("${origin.x}, ${origin.y}")
}
```

An omitted field is zero-initialized, and `Point{}` zeroes every field.

`new(Point)` also returns a zero-initialized `Point`, but allocates it on the heap and gives you a pointer to it (`^Point`). Fields are reached with dot notation either way.

```gray
const Point struct {
    x i64
    y i64
}

do main() {
    mut on_stack Point = Point{}
    mut on_heap ^Point = new(Point)
    on_heap.x = 5
    println("${on_stack.x} ${on_heap.x} ${on_heap^.y}")
}
```

A `new()` value lives until the program exits, so a pointer to it can be returned from a function or stored anywhere.

## Default field values

A field can declare a default with `= expr`. A struct literal or `new()` that omits the field uses it.

```gray
const Config struct {
    host string = "localhost"
    port i64 = 8080
    verbose bool = false
}

do main() {
    mut config = Config{port: 3000}
    println("${config.host}:${config.port}")
}
```

## Struct functions

Functions declared inside a struct block are namespaced under the type. There is no implicit `self`: every parameter is written out.

```gray
const Vec struct {
    x i64
    y i64

    do create(x i64, y i64) -> Vec {
        return Vec{x: x, y: y}
    }

    do length_squared(v Vec) -> i64 {
        return v.x * v.x + v.y * v.y
    }
}

do main() {
    mut a = Vec.create(3, 4)
    println(Vec.length_squared(a))
    println(a.length_squared())
}
```

When the first parameter is the struct, you can call the function on an instance: `a.length_squared()` is the same as `Vec.length_squared(a)`. Functions whose first parameter is not the struct, like `create`, are called through the type name.

### Mutating through a struct function

Prefix the first parameter with `&` to modify the caller's variable.

```gray
const Counter struct {
    count i64

    do bump(&c Counter) {
        c.count = c.count + 1
    }
}

do main() {
    mut counter = Counter{count: 0}
    counter.bump()
    counter.bump()
    println(counter.count)
}
```

### Private functions in structs

`private` restricts a struct function to the other functions of the same struct. Siblings call each other by bare name.

```gray
const Calculator struct {
    value i64

    private do internal_add(a i64, b i64) -> i64 {
        return a + b
    }

    do add(a i64, b i64) -> i64 {
        return internal_add(a, b)
    }
}

do main() {
    println(Calculator.add(2, 3))
}
```

## Recursive structs

A struct refers to itself through a pointer field. Dot notation dereferences pointer fields automatically.

```gray
const Node struct {
    val i64
    next ^Node
}

do main() {
    mut a = new(Node)
    mut b = new(Node)
    a.val = 1
    b.val = 2
    a.next = b
    println(a.val)
    println(a.next.val)
}
```
