---
title: "Modules and Imports"
sidebar:
  order: 12
---

A file's module name is its filename without `.gray`. There are no module declarations. Standard library modules are imported with `@`, local files with a relative path.

## Importing a local file

```gray title="main.gray"
import "./helpers"

do main() {
    println(helpers.greet("Grayscale"))
}
```

```gray title="helpers.gray"
do greet(name string) -> string {
    return "Hello, ${name}!"
}
```

Relative paths resolve from the directory of the importing file, not from the entry point.

## Importing a directory

Importing a directory merges every `.gray` file directly inside it into one module named after the directory. Subdirectories are separate modules.

```gray title="main.gray"
import "./models"

do main() {
    mut user = models.User{name: "alice"}
    println(models.describe(user))
}
```

```gray title="models/user.gray"
const User struct {
    name string
}
```

```gray title="models/describe.gray"
do describe(user User) -> string {
    return "user ${user.name}"
}
```

## Several imports and aliases

Separate imports with commas. Only local imports can be aliased, which is how you resolve a name collision or import a file whose name is not a valid identifier.

```gray title="main.gray"
import @math, greeter "./my-greeter"

do main() {
    println(greeter.hello())
    println(math.sqrt(16.0))
}
```

```gray title="my-greeter.gray"
do hello() -> string {
    return "hello"
}
```

## Private declarations

Everything at the top level of a file is public by default. `private` keeps a declaration inside its own file: it works on functions, constants, structs, enums and aliases, not only struct functions.

```gray title="main.gray"
import "./mathlib"

do main() {
    println(mathlib.factorial(5))
}
```

```gray title="mathlib.gray"
private const LIMIT i64 = 20

private do valid(n i64) -> bool {
    return n >= 0 && n <= LIMIT
}

do factorial(n i64) -> i64 {
    if !valid(n) {
        return 1
    }
    mut result i64 = 1
    for i in range(2, n + 1) {
        result = result * i
    }
    return result
}
```

Code in `main.gray` can call `mathlib.factorial` but not `mathlib.valid` or `mathlib.LIMIT`. Struct functions can be `private` as well; see the Structs page.

## Bringing names into scope with `using`

`using` lets you call a module's functions without the prefix. Put it at file scope or inside one function.

```gray
import @strings

using strings

do main() {
    println(to_upper("hello"))
}
```

`import and use @strings` does both in one line. If two modules in scope both define a name, call it with its prefix.

```gray
import and use @math

do main() {
    println(sqrt(25.0))
}
```
