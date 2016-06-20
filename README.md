# base1

Base1 encodes arbitrary binary data as a string of repeated "A" characters. With analogy to the [unary numeral system](https://en.wikipedia.org/wiki/Unary_numeral_system), the binary data is encoded in the length of the string. An empty input becomes the empty string. The single byte 0x00 becomes "A", 0x01 becomes "AA" and so on.

Base1 is not the most inefficient possible binary encoding, but it is a step in that direction: 1MB of input yields approximately 2<sup>8,388,580</sup>MB of output. (Twice that, if using UTF-16.)

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

| Buffer size | Number of possible inputs | Minimum length of output | Maximum length of output |
| ----------- | ------------------------- | ------------------------ | ------------------------ |
| 0 bytes     | 1                         | 0 As ("")                | 0 As ("")                |
| 1 byte      | 256                       | 1 A ("A")                | 256 As ("AAAA...A")      |
| 2 bytes     | 65,536                    | 257 As                   | 65,792 As                |
| 3 bytes     | 16,777,216                | 65,793 As                | 16,843,008 As            |
| 4 bytes     | 4,294,967,296             | 16,843,009 As            | 4,311,810,305 As         |
| ...         | ...                       | ...                      | ...                      |
| <var>N</var> bytes | 256<sup><var>N</var></sup> | (256<sup><var>N</var></sup> - 1) / (256 - 1) As | (256<sup><var>N</var> + 1</sup> - 1) / (256 - 1) As |

The maximum safe integer in JavaScript is [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) = 9,007,199,254,740,991, which corresponds to the 7-byte sequence 0x1E 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE. Passing a longer or "greater" buffer (e.g. ending in 0xFF instead) to `encodeL` results in an error; passing 9,007,199,254,740,992 or higher to `decodeL` causes a similar error.

### encode and decode

The method `encode` calls `encodeL` to get a length `l`, then returns a string which is `l` repetitions of "A" in a row. `decode` reverses this process. An empty buffer is mapped to the empty string, 1-byte buffers are mapped to the strings "A" to "AAAAA...A" (256 characters) inclusive, and so on.

Here the upper limits are much lower and possibly platform-dependent. JavaScript specifies no maximum length for a string, although MDN's polyfill for [`String.prototype.repeat`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) gives an upper limit of 2<sup>28</sup> - 1 = 268,435,455 characters. This is equivalent to the 4-byte sequence 0x0E 0xFE 0xFE 0xFE. Larger or "greater" buffers may raise errors and longer strings may not even be constructible. Note that `base1` performs no explicit checks here; it is assumed that the underlying JavaScript engine will instead.
