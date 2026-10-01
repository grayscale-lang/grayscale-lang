---
title: "CSV, Regex and SQLite"
sidebar:
  order: 21
---

## CSV

```gray
import @csv

do main() {
    mut table [[string]] = csv.parse("name,age\nalice,30\nbob,25")
    mut rows [map[string:string]] = csv.to_maps(table)
    for_each row in rows {
        println("${row["name"]} is ${row["age"]}")
    }
    println(csv.encode(table))
}
```

## Regular expressions

Patterns use POSIX extended syntax. Functions that can fail return an `Error`.

```gray
import @regex

do main() {
    println(regex.is_match("[0-9]+", "order 42"))
    mut found, err = regex.find("[0-9]+", "order 42")
    if err != nil {
        println("no match")
        exit(1)
    }
    println(found)
    println(regex.count("a", "banana"))
}
```

## SQLite

```gray
import @sqlite

do main() {
    mut db, open_err = sqlite.open(":memory:")
    if open_err != nil {
        println("open failed")
        exit(1)
    }

    mut created, create_err = sqlite.exec(db, "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
    mut added, add_err = sqlite.exec_params(db, "INSERT INTO users (name) VALUES (?)", {"Alice"})

    mut rows, query_err = sqlite.query(db, "SELECT name FROM users")
    if query_err != nil {
        println("query failed")
        exit(1)
    }
    for_each row in rows {
        println(row["name"])
    }
    println(created && added)
    println(create_err == nil && add_err == nil)
    sqlite.close(db)
}
```

Use `exec_params` and `query_params` for any value that comes from outside your program, so it is bound as a parameter instead of pasted into the SQL.
