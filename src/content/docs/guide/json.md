---
title: "JSON"
sidebar:
  order: 17
---

## Encoding a struct

Mark a struct with `#json` to serialize it. `#json` structs cannot have default field values.

```gray
import @json

#json
const Person struct {
    name string
    age i64
}

do main() {
    mut person = Person{name: "Alice", age: 30}
    println(json.stringify(person))
}
```

## Decoding into a struct

`json.parse` takes its target type from the variable it is assigned to.

```gray
import @json

#json
const Person struct {
    name string
    age i64
}

do main() {
    mut person Person = json.parse("{\"name\": \"Bob\", \"age\": 25}")
    println("${person.name} is ${person.age}")
}
```

## Working with arbitrary JSON

`json.decode` turns an object into a map and returns an `Error`. `is_valid` checks text without decoding it.

```gray
import @json

do main() {
    if !json.is_valid("{\"a\": 1}") {
        println("invalid")
        exit(1)
    }
    mut record, err = json.decode("{\"city\": \"Oslo\"}")
    if err != nil {
        println("decode failed")
        exit(1)
    }
    println(record["city"])
}
```
