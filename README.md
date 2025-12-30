# base1

Base1 encodes arbitrary binary data as a string of repeated "A" characters. With analogy to the [unary numeral system](https://en.wikipedia.org/wiki/Unary_numeral_system), the binary data is encoded in the length of the string. This JavaScript module, `base1`, is the first implementation of the Base1 encoding.

An empty input becomes the empty string. The single byte 0x00 becomes "A". 0x01 becomes "AA". 0x02 becomes "AAA". 0xFF becomes

> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

(256 As). 0x00 0x00 becomes

> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

(257 As), and so on.

Base1 is not the most inefficient possible binary encoding, but it is a step in that direction: 1MB of input yields approximately 2<sup>8,388,580</sup>MB of output. (Twice that, if using UTF-16.)

## How it works

The Base1 encoding is *not* as simple as taking the binary as a place-value base 256 number. This would give no way to distinguish buffers with leading null bytes from one another. We have to encode the length of the source buffer as well. We do this by sorting all possible buffers by length and then lexicographically, then simply returning the index of the buffer in the list.

| Buffer length | Buffers of this length | Minimum length of Base1 | Maximum length of Base1 |
| ------------- | ---------------------- | ----------------------- | ----------------------- |
| 0 bytes       | 1                      | 0                       | 0                       |
| 1 byte        | 256                    | 1                       | 256                     |
| 2 bytes       | 65,536                 | 257                     | 65,792                  |
| 3 bytes       | 16,777,216             | 65,793                  | 16,843,008              |
| 4 bytes       | 4,294,967,296          | 16,843,009              | 4,311,810,304           |
| ...           | ...                    | ...                     | ...                     |
| <var>N</var> bytes | 256<sup><var>N</var></sup> | (256<sup><var>N</var></sup> - 1) / (256 - 1) | (256<sup><var>N</var> + 1</sup> - 1) / (256 - 1) - 1 |

## Installation

```bash
npm install base1
```

## Usage

```js
import { encodeL, encode, decodeL, decode } from 'base1'

const uint8Array = Uint8Array.from([0x03, 0xC0])

const l   = encodeL(uint8Array) // 1217n
const str = encode(uint8Array)  // "AAAAAAAAAAAA...AA", string is 1,217 characters long

const uint8Array2 = decode(str) // Uint8Array [ 3, 192 ]
const uint8Array3 = decodeL(l)  // Uint8Array [ 3, 192 ]
```

## API

`base1` accepts and returns `Uint8Array`s. Note that every Node.js `Buffer` is a `Uint8Array`. A `Uint8Array` can be converted to a Node.js `Buffer` like so:

```js
const buffer = Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength)
```

### encodeL(uint8Array)

Input a `Uint8Array`. Returns a Base1 string length, in the form of a BigInt.

### encode(uint8Array)

Encodes a `Uint8Array` as a Base1 string. This method calls `base1.encodeL` to get a length `l` and then returns a string which is `l` repetitions of "A" in a row.

JavaScript does not specify, nor does `base1` enforce, a maximum length for a string. However, MDN's polyfill for [`String.prototype.repeat`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) gives an upper limit of 2<sup>28</sup> - 1 = 268,435,455 characters. This is equivalent to the 4-byte sequence 0x0E 0xFE 0xFE 0xFE. Buffers which are longer or lexicographically greater than this may cause errors in your JavaScript engine.

### decodeL(l)

Take a Base1 string length in the form of a BigInt and return a `Uint8Array` containing the data which it represents.

### decode(str)

Decode a Base1 string and return a `Uint8Array` containing the data which it represents.

## Ports

This is a JavaScript implementation of the Base1 encoding. It has also been ported:

* [C](https://github.com/girst/base1)
* [Rust](https://crates.io/crates/base1)
* [Python](https://pypi.org/project/base-one/)
