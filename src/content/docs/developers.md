---
title: "Developers"
description: "Build Grayscale from source, run its tests, and contribute changes."
---

This page is for people who build Grayscale from source or contribute to it. To just use the language, download a release from the [downloads page](/grayscale-lang/downloads/).

## Requirements

- [Go](https://go.dev/dl/) 1.23 or newer, for the `gray` CLI. Download the pre-built binary, not the source.
- A C11 compiler with GNU extensions: [GCC](https://gcc.gnu.org/releases.html), [Clang](https://releases.llvm.org/download.html) or [TinyCC](https://download.savannah.gnu.org/releases/tinycc/). See the table below.
- [Git](https://git-scm.com/downloads).
- [GNU Make](https://www.gnu.org/software/make/#download).

## C compiler support

`grayc` compiles Grayscale to C, then hands the C to your compiler. The generated code uses GNU C (statement expressions, `__auto_type`, `__typeof__`, `__builtin_*_overflow`), so MSVC is not supported and is not planned.

| Compiler | Minimum version | macOS | Linux | Windows |
|---|---|---|---|---|
| [**Clang**](https://releases.llvm.org/download.html) | 14+ | Supported | Supported | Not supported |
| [**GCC**](https://gcc.gnu.org/releases.html) | 11+ | Supported ([Homebrew GCC](https://formulae.brew.sh/formula/gcc)) | Supported | Supported ([MinGW-w64](https://www.mingw-w64.org/downloads/), until TinyCC replaces it) |
| [**TinyCC**](https://download.savannah.gnu.org/releases/tinycc/) | 0.9.27+ | Supported | Supported | Planned |

On macOS, `cc` and `gcc` are both Apple Clang unless GCC is installed separately. TinyCC compiles much faster, which suits the edit-run loop; it builds the runtime from source on every compile instead of linking `libgrayrt.a`. TinyCC does not support the sanitizers.

### How the compiler is chosen

`gray` uses the first of these that works:

1. `--cc <compiler>` on `gray <file>` or `gray build`, for one invocation. This takes precedence over everything else.
2. The `GRAY_CC` environment variable, then `CC`. Each is probed and skipped if it does not run; multi-word values are ignored, so use `--cc` for those.
3. `cc`, `gcc`, then `clang` on `PATH` (`gcc`, `clang`, then `cc` on Windows).
4. Windows only: the well-known install locations for MSYS2, MinGW-w64, Chocolatey and LLVM.

`GRAY_CC` and `CC` are different settings. `GRAY_CC` is the compiler `gray` uses for `.gray` programs. `CC` is the compiler `make` uses to build `grayc` and the runtime, and `gray` falls back to it only when `GRAY_CC` is unset.

```bash
gray main.gray --cc tcc
CC=clang GRAY_CC=gcc make build   # grayc and the runtime built with clang, programs with gcc
```

## Build from source

```bash
git clone https://github.com/grayscale-lang/grayscale.git
cd grayscale
make build
make install
```

Check the build with a one-line program:

```bash
echo 'do main() { println("hello") }' > main.gray
./gray main.gray
```

`make install` also installs tab completion for your shell when its completion directory is writable, and never edits an rc file.

When `./gray` runs from a source checkout it prefers the locally built `grayc/grayc` next to it over the embedded or installed compiler, so `make -C grayc build` is picked up on the next run. Set `GRAY_COMPILER_PATH=/path/to/grayc` to point at a compiler somewhere else; the explicit override always wins.

Run `make help` to list the make targets, or `make help TARGET=build` for what one target does and which variables it reads.

### Windows

Install [MinGW-w64](https://www.mingw-w64.org/downloads/) (the command below installs the [WinLibs](https://winlibs.com/) build) and [Go](https://go.dev/dl/), then use `make` as on any other platform. `make` needs a POSIX shell, which [MSYS2](https://www.msys2.org/) and [Git for Windows](https://git-scm.com/download/win) (Git Bash) both provide.

```powershell
winget install BrechtSanders.WinLibs.POSIX.UCRT.Base   # or: choco install mingw
git clone https://github.com/grayscale-lang/grayscale.git
cd grayscale
make build
```

`make build` produces `grayc.exe` and `gray.exe`, and `make install` installs to `%USERPROFILE%\.gray\bin` and prints PATH instructions. The compiler finds MinGW in its default install locations, so it does not need to be on `PATH`. The sanitizer and leak-check targets have no MinGW equivalent and say so instead of failing obscurely.

## How the compiler works

```
Source (.gray) → Lexer → Parser → Type Checker → Code Gen → C file → cc → Binary
```

| Stage | Location |
|---|---|
| Lexer | `grayc/src/lexer/` |
| Parser | `grayc/src/parser/` |
| Type checker | `grayc/src/typechecker/` |
| Code generator | `grayc/src/codegen/` |
| Runtime (strings, arrays, maps, arenas) | `grayc/src/runtime/` |
| Standard library | `grayc/src/stdlib/` |

The `gray` CLI in `cli/` is a Go wrapper that invokes the compiler and provides `watch`, `doc`, `fmt` and self-update.

A new language feature touches the compiler stages in order: lexer, parser, type checker, code generator. A new stdlib function goes in `grayc/src/stdlib/` and is wired into the type checker and code generator. Developer tooling lives in the Go code under `cli/`.

### Where to look

| Task | Where |
|---|---|
| Change syntax | `grayc/src/parser/parser.c`, `grayc/src/parser/ast.h` |
| Add a keyword or token | `grayc/src/lexer/lexer.c`, `grayc/src/lexer/token.h` |
| Modify type checking | `grayc/src/typechecker/typechecker.c` |
| Change code generation | `grayc/src/codegen/codegen.c` |
| Add or change diagnostics | `grayc/src/util/error_codes.h` |
| Change source formatting | `grayc/src/fmt/`, `cli/fmt.go` |
| Fix import resolution | `grayc/src/parser/imports.c`, `grayc/src/parser/module_table.c` |
| Scaffold a new project type | `cli/new.go`, `cli/templates/` |
| Change CI or release workflows | `.github/workflows/` |

The language specification, `STANDARD.md` in the repository, is the canonical reference for syntax, types and every stdlib module. Read it before changing language behavior.

### Portable compiler code

`grayc/src/util/platform.h` is the single place OS differences are handled. Use its helpers (`gray_path_join()`, `gray_realpath()`, `gray_spawn_path()` and the rest) instead of POSIX headers. The compiler invokes the C compiler through an argv array, never a shell string, so do not reintroduce `system()`. Keep `<windows.h>` inside `platform.c`: it defines `ERROR`, `min` and `max` as macros, which collide with the compiler's own names.

## Testing

```bash
make test               # unit, e2e, integration and Go tests
make test-unit          # C unit tests: lexer, parser, type checker, runtime, stdlib, panics
make test-e2e           # end-to-end codegen tests
make test-integration   # .gray programs: pass and fail
make test-go            # Go unit tests for the CLI
make test-ubsan         # UBSan sanitizer tests
make test-asan          # ASan + UBSan tests (Linux recommended)
```

All targets run from the repository root.

- **Unit and e2e tests** live in `grayc/tests/`. Each component has its own suite, and the e2e suite compiles and runs programs to check output.
- **Integration tests** live in `integration-tests/`. `pass/` holds programs that must run and report success (`core/`, `stdlib/`, `new/`, `warnings/`, `multi-file/`, `stress/`). `fail/` holds minimal programs that must be rejected with a non-zero exit code.
- **Fail tests** are named for the error they trigger, such as `E3001_type_mismatch.gray` in `integration-tests/fail/errors/`.
- **Vendored dependencies** are checked by `bash scripts/check_vendor.sh`, which verifies the recorded SHA256 of every third-party file under `grayc/src/vendor/` and reports advisories for each pinned version.

### Testing with a specific compiler

`GRAY_CC` builds user programs and applies to `make test-integration` and `make test-e2e`. `CC` builds `grayc` itself and applies to `make test-unit` and the sanitizer suites.

```bash
GRAY_CC=tcc make test-integration
CC=clang make test-ubsan
```

Run `make clean` when you switch compilers; object files built by one do not link with another's, and `make` does not rebuild them when `CC` changes. Homebrew GCC on macOS ships without the sanitizer libraries, so use `clang` for `test-ubsan` and `test-asan` there.

### CI

Every push to `main` runs unit, e2e and integration tests on Ubuntu, macOS and Windows, UBSan on Ubuntu and macOS, ASan on Ubuntu, and the Go tests on Windows. A separate job runs the integration suite with TinyCC on Linux. On Windows, `test_panics` is skipped because it forks a child process per case and Windows has no `fork`. With no POSIX shell, use `.\scripts\test.ps1`.

## Making a change

Edit, rebuild, and run a small `.gray` file:

```bash
make build
./gray main.gray
```

Add tests before opening a pull request: an integration test for behavior, a fail test for a new error, and a C unit test for compiler internals.

### Adding a stdlib function, builtin, constant or type

All of these are required before the change is ready:

1. Declare it in `grayc/src/stdlib/<module>.h` with a `@man` block, and implement it in `grayc/src/stdlib/<module>.c`.
2. Teach the type checker its signature: return type, argument count and types, and fallibility.
3. Emit the C call in `grayc/src/codegen/codegen.c`.
4. Add it to the module's table in `STANDARD.md`.
5. Run `./scripts/generate_stdlib_man.sh` (or `./scripts/generate_builtins_man.sh` for builtins) and commit the output.
6. Confirm `make build` compiles with zero warnings.

Find an existing function in the same module, grep for every place its name appears, and mirror it.

### Adding or changing diagnostics

Every error, warning and runtime panic is defined in `grayc/src/util/error_codes.h`.

1. Add the code with `GRAY_ERROR`, `GRAY_WARNING` or `GRAY_PANIC`. One code is one user-visible situation: reuse the most specific existing code, and add new codes at the end of their range.
2. Emit it from the parser, type checker or code generator with the helpers in `grayc/src/util/error.h`.
3. Run `./scripts/generate_errors.sh` and commit the regenerated `ERRORS.md`.
4. Add a fail test named `E####_short_description.gray` under `integration-tests/fail/errors/`.

`scripts/check_error_codes.gray` runs in CI and fails on a code that is emitted but unregistered, registered but never emitted, duplicated, emitted from both `parser.c` and `typechecker.c`, or spread across more than 15 call sites.

### Updating a vendored dependency

Third-party C under `grayc/src/vendor/` (currently SQLite) is pinned in `grayc/src/vendor/MANIFEST.toml` with its version, upstream URL, hashes, license and local modifications. To bump one, replace the files with the upstream release, update the manifest entry, run `./scripts/check_vendor.sh` until every file reports `ok`, triage the advisories, and commit with `chore(vendor): bump sqlite to <version>`.

## Code style

- Go: run `gofmt`.
- C: run `clang-format -i` on files you touch, using the `.clang-format` under `grayc/`, and match the surrounding code.
- Comment only non-obvious logic.
- Add yourself to the `Contributors:` section of the header of any source file you change.

## Commits and pull requests

Commits use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): short description`, under about 72 characters, lowercase, no trailing period.

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Tests |
| `refactor` | Neither a fix nor a feature |
| `chore` | Build, CI, tooling, maintenance |

Common scopes are `lexer`, `parser`, `typechecker`, `codegen`, `runtime`, `stdlib` (optionally `stdlib/strings`), `cli`, `tests`, `docs`, `ci` and `vendor`.

```text
feat(parser): add named return variables support
fix(typechecker): prevent false positive on nested struct init
feat(stdlib/strings): add 12 new string utility functions
```

To contribute, fork the repository, add the upstream remote, and create a branch named `feat/`, `fix/`, `docs/`, `refactor/` or `test/` followed by a short name. Push it to your fork and open a pull request against `main`. Keep the change focused, describe what changed and why, and make sure `make test` passes.

## Reporting issues

A bug report must include the full output of `gray report` (version, commit, install path, OS, CPU, RAM and C compiler) and a minimal `.gray` reproduction. Reports missing either are parked until they have both. For a feature request, describe the use case and why existing features do not solve it.

Looking for a first contribution? Browse the [good first issues](https://github.com/grayscale-lang/grayscale/labels/good%20first%20issue).
