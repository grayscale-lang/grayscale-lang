---
title: "Encoding, Hashing and Bytes"
sidebar:
  order: 22
---

## Text encodings

`encoding` converts strings between common representations.

```gray
import @encoding

do main() {
    mut encoded string = encoding.base64_encode("hello")
    println(encoded)
    println(encoding.base64_decode(encoded))
    println(encoding.hex_encode("hi"))
    println(encoding.url_encode("a b&c"))
    println(encoding.html_escape("<b>"))
}
```

The same module converts to and from byte arrays.

```gray
import @encoding

do main() {
    mut bytes [u8] = encoding.from_string("abc")
    println(len(bytes))
    println(encoding.to_hex(bytes))
    println(encoding.to_string(bytes))
}
```

## Hashing

```gray
import @crypto

do main() {
    println(crypto.sha256("hello"))
    println(crypto.hmac_sha256("key", "message"))
    println(crypto.constant_time_equal("abc", "abc"))
    println(len(crypto.random_hex(16)))
}
```

Use `constant_time_equal` to compare secrets such as tokens, so the comparison time does not leak how many characters matched. `md5` and `sha1` exist for compatibility with older formats; prefer `sha256` or `sha512`.

## Binary integers

`binary` turns integers into `[u8]` and back, in little-endian (`_le`) or big-endian (`_be`) order.

```gray
import @binary

do main() {
    mut bytes [u8] = binary.encode_i32_le(1000)
    println(len(bytes))
    mut value i32 = binary.decode_i32_le(bytes)
    println(value)
}
```

```gray
import @binary

do main() {
    mut big [u8] = binary.encode_u16_be(258)
    println(big[0])
    println(big[1])
}
```
