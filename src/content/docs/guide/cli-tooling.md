---
title: "The gray Command"
sidebar:
  order: 26
---

`gray` compiles, runs, checks, formats and documents Grayscale code. Run `gray --help` for the full command list.

## Start a project

`gray new` scaffolds a project. Pick a template with `-t`: `basic` (the default), `cli`, `lib`, `multi`, `server` or `client`.

```bash
gray new myapp
gray new tool -t cli
gray new api -t server -s minimal
```

`-s minimal` or `-s normal` applies to the `server` and `client` templates. With no arguments, `gray new` asks for the name and template interactively.

## Run, build, check

```bash
gray main.gray                 # compile and run
gray main.gray -- --port 8080  # arguments after -- go to your program
gray build main.gray -o myapp  # native binary
gray build main.gray --emit-c  # write main.c and stop
gray check main.gray           # type check only
gray watch main.gray           # re-run whenever a file changes
```

`gray watch` also watches the files your program imports.

These flags work on `gray <file>`, `build`, `check` and `watch`:

| Flag | Effect |
|------|--------|
| `-q, --quiet <codes>` | Hide warnings: `all`, or a list like `W1001,W1003` |
| `--no-color` | Plain diagnostics |
| `--arena-limit=<size>` | Cap arena memory, for example `256MB`. The default is `1GB` |

`gray build --time` prints how long compilation took.

## Choosing the C compiler

Grayscale generates C and hands it to the first of `$GRAY_CC`, `$CC`, `cc`, `gcc` or `clang` it finds. TinyCC (`tcc`) compiles faster, which suits a tight edit-run loop.

```bash
GRAY_CC=tcc gray main.gray
```

## Tests

Mark functions with `#test` and run them with `gray test`.

```gray
#doc("Adds two numbers")
do add(a i64, b i64) -> i64 {
    return a + b
}

#test
do test_add() {
    assert(add(2, 3) == 5)
    assert(add(0, 0) == 0)
}

do main() {
    println(add(1, 2))
}
```

```bash
gray test                # every #test under the current directory
gray test math.gray      # one file
gray test ./src/...      # a directory, recursively
```

## Formatting

`gray fmt` rewrites files in place: 4-space indentation, no trailing whitespace, one final newline, and no more than two blank lines in a row. `--check` changes nothing and exits non-zero if a file would change, which suits CI.

```bash
gray fmt main.gray
gray fmt ./...
gray fmt --check ./...
```

A path is a file, a directory (not recursive), or `dir/...` and `./...` (recursive). `gray doc` and `gray test` take the same patterns.

## Documentation

`gray doc` reads `#doc` attributes and writes a markdown file, `DOCS.md` unless you pass `-o`.

```bash
gray doc main.gray
gray doc ./... -o API.md
```

`gray man` shows built-in documentation from the terminal. Leave off `()` when naming a function, and leave off the `#` when naming an attribute.

```bash
gray man                 # usage and the list of modules
gray man math            # everything in one module
gray man println         # one function
gray man strings.contains
gray man keywords
gray man flags           # the #flags attribute
```

## Cross-compiling

`gray cross build` uses Zig as the C compiler, so Zig must be on your `PATH`. Native builds do not need it.

```bash
gray cross targets
gray cross build main.gray --target linux-arm64 -o myapp
```

Supported targets are `linux-amd64`, `linux-arm64`, `windows-amd64`, `mac-arm64` and `mac-amd64`.

## Maintaining the toolchain

```bash
gray version            # installed version and whether an update exists
gray update             # upgrade to the latest release
gray update --pre       # latest pre-release instead
gray install 3.0.0      # install an exact version
gray verify             # compile and run a built-in self-test
gray report             # system details to paste into a bug report
```
