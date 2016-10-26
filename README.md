# base1

Base1 encodes arbitrary binary data as a string of repeated "A" characters. With analogy to the [unary numeral system](https://en.wikipedia.org/wiki/Unary_numeral_system), the binary data is encoded in the length of the string. This JavaScript module, `base1`, is the first implementation of the Base1 encoding.

An empty input becomes the empty string. The single byte 0x00 becomes "A". 0x01 becomes "AA". 0x02 becomes "AAA". 0xFF becomes

> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

(256 As). 0x00 0x00 becomes

> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

(257 As), and so on.

Base1 is not the most inefficient possible binary encoding, but it is a step in that direction: 1MB of input yields approximately 2<sup>8,388,580</sup>MB of output. (Twice that, if using UTF-16.)

## How it works

The Base1 encoding is *not* as simple as taking the binary as a place-value base 256 number. This would give no way to distinguish buffers with leading null bytes from one another. We have to encode the length of the source buffer as well. We do this by sorting all possible buffers lexicographically and then simply return the index of the buffer in the list.

| Buffer length | Number of possible buffers | Minimum length of output | Maximum length of output |
| ------------- | -------------------------- | ------------------------ | ------------------------ |
| 0 bytes       | 1                          | 0                        | 0                        |
| 1 byte        | 256                        | 1                        | 256                      |
| 2 bytes       | 65,536                     | 257                      | 65,792                   |
| 3 bytes       | 16,777,216                 | 65,793                   | 16,843,008               |
| 4 bytes       | 4,294,967,296              | 16,843,009               | 4,311,810,304            |
| ...           | ...                        | ...                      | ...                      |
| <var>N</var> bytes | 256<sup><var>N</var></sup> | (256<sup><var>N</var></sup> - 1) / (256 - 1) | (256<sup><var>N</var> + 1</sup> - 1) / (256 - 1) - 1 |

## Installation

```bash
npm install base1
```

## Usage

```js
var base1 = require("base1");

var buf = new Buffer([0x03, 0xC0]); 

var l   = base1.encodeL(buf); // 1217
var str = base1.encode(buf);  // "AAAAAAAAAAAA...AA", string is 1,217 characters long

var buf2 = base1.decode(str); // <Buffer 03 c0>
var buf3 = base1.decodeL(l);  // <Buffer 03 c0>
```

## API

### encodeL and decodeL

The methods `encodeL` and `decodeL` map buffers to Base1 string lengths.

The maximum safe integer in JavaScript is [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) = 9,007,199,254,740,991, which corresponds to the 7-byte sequence 0x1E 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE. Passing a longer or "greater" buffer (e.g. ending in 0xFF instead) to `encodeL` results in an error; passing 9,007,199,254,740,992 or higher to `decodeL` causes a similar error.

### encode and decode

The method `encode` calls `encodeL` to get a length `l`, then returns a string which is `l` repetitions of "A" in a row. `decode` reverses this process. An empty buffer is mapped to the empty string, 1-byte buffers are mapped to the strings "A" to "AAAAA...A" (256 characters) inclusive, and so on.

Here the upper limits are much lower and possibly platform-dependent. JavaScript specifies no maximum length for a string, although MDN's polyfill for [`String.prototype.repeat`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) gives an upper limit of 2<sup>28</sup> - 1 = 268,435,455 characters. This is equivalent to the 4-byte sequence 0x0E 0xFE 0xFE 0xFE. Larger or "greater" buffers may raise errors and longer strings may not even be constructible. Note that `base1` performs no explicit checks here; it is assumed that the underlying JavaScript engine will instead.
