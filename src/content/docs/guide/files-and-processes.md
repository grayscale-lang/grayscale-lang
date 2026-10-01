---
title: "Files and the System"
sidebar:
  order: 16
---

## Reading and writing files

The `io` functions that can fail return an `Error` as the last value.

```gray
import @io

do main() {
    mut written, write_err = io.write_file("notes.txt", "first line\nsecond line\n")
    if write_err != nil {
        println("write failed: ${write_err}")
        exit(1)
    }

    mut lines, read_err = io.read_lines("notes.txt")
    if read_err != nil {
        println("read failed: ${read_err}")
        exit(1)
    }
    for_each line in lines {
        println(line)
    }
    println(written)
}
```

Check a path before using it.

```gray
import @io

do main() {
    if io.file_exists("notes.txt") {
        mut size, err = io.file_size("notes.txt")
        if err == nil {
            println(size)
        }
    }
    println(io.path_join({"/home", "user", "docs"}))
}
```

## Environment and processes

```gray
import @os

do main() {
    println(os.cpu_count() > 0)
    mut home string = os.home_dir()
    println(len(home) > 0)

    when os.current_os() {
        is .LINUX { println("linux") }
        is .MAC_OS { println("macos") }
        default { println("other") }
    }
}
```

`os.exec` runs a program and returns its exit code, output, error output, and whether it launched.

```gray
import @os

do main() {
    mut code, output, errors, launched = os.exec("echo", {"hello"})
    if !launched {
        println("could not launch")
        exit(1)
    }
    println("${code}: ${output}")
    println(len(errors))
}
```
