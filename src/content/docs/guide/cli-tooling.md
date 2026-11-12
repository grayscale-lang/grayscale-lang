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

`-s minimal` or `-s normal` applies to the `server` and `client` templates. `-c` adds helpful syntax comments to the generated files, and `-f` overwrites an existing directory. With no arguments, `gray new` asks for the name and template interactively.

## Run, build, check

```bash
gray main.gray                 # compile and run
gray main.gray -- --port 8080  # arguments after -- go to your program
gray build main.gray -o myapp  # native binary
gray build main.gray --emit-c  # write main.c and stop
gray check main.gray           # type check only
gray check ./...               # type check every directory under here
gray watch main.gray           # re-run whenever a file changes
```

`gray watch` also watches the files your program imports. It accepts a directory too, which must hold exactly one file with a `main` function. `gray check` accepts a file, a directory, or `dir/...` for every directory under it, each checked as its own module.

These flags work on `gray <file>`, `build`, `check` and `watch`:

| Flag | Effect |
|------|--------|
| `-q, --quiet <codes>` | Hide warnings: `all`, or a list like `W1001,W1003` |
| `--no-color` | Plain diagnostics |
| `--arena-limit=<size>` | Cap arena memory, for example `256MB`. The default is `1GB` |
| `-define:NAME=VALUE` | Override a `#define` constant at build time |
| `--cc <compiler>` | C compiler to use, a name on `PATH` or a path. Overrides `GRAY_CC` and `CC` |

`gray build --time` prints how long compilation took.

## Choosing the C compiler

Grayscale generates C and hands it to the first of these it finds: `--cc`, then `$GRAY_CC`, then `$CC`, then `cc`, `gcc` or `clang` on `PATH`. TinyCC (`tcc`) compiles faster, which suits a tight edit-run loop.

```bash
GRAY_CC=tcc gray main.gray
gray main.gray --cc clang
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
gray test ./src          # the files directly inside a directory
gray test ./src/...      # a directory, recursively
```

A failed `assert` or any panic inside a test is reported as a failure and the runner continues with the remaining tests. `gray test` exits non-zero if any test fails or any file fails to compile.

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
gray install v0.11.5    # install an exact version
gray verify             # compile and run a built-in self-test (not available on Windows)
gray report             # system details to paste into a bug report
```

Releases are experimental builds named `experimental-YYYYMMDD-build#`: the UTC date of the merge into `main`, then a build number that counts up from 1 within that date. If you are on 0.14.1 or earlier, `gray update` cannot see experimental builds. Download one from the Releases page and replace your `gray` binary once. After that, `gray update` installs every newer release.
