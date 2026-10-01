---
title: "Concurrency"
sidebar:
  order: 14
---

Threading lives in four standard library modules: `threads`, `sync`, `channels` and `atomic`. They need POSIX threads.

## Spawning threads

`threads.spawn` runs a function on a new thread and returns a handle. `threads.join` waits for it.

```gray
import @threads

do worker() {
    println("hello from a thread")
}

do main() {
    mut handle = threads.spawn(()worker)
    threads.join(handle)
}
```

## Sending messages with channels

A channel is a buffered queue. Channels carry `i64` values only.

```gray
import @channels

do main() {
    mut ch = channels.open(4)
    channels.send(ch, 10)
    channels.send(ch, 20)
    mut first = channels.receive(ch)
    mut second = channels.receive(ch)
    println(first + second)
    channels.close(ch)
}
```

## Protecting shared data with a mutex

```gray
import @sync

do main() {
    mut lock = sync.mutex()
    sync.lock(lock)
    println("inside the critical section")
    sync.unlock(lock)
    sync.destroy(lock)
}
```

## Atomic counters

`atomic` operates on `^i64` pointers without a lock. `add` returns the previous value.

```gray
import @atomic

do main() {
    mut counter i64 = 0
    mut previous = atomic.add(addr(counter), 5)
    println("${previous} -> ${atomic.load(addr(counter))}")
}
```
