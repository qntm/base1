# base1

Base1 encodes arbitrary binary data as a string of repeated "A" characters. With analogy to the [unary numeral system](https://en.wikipedia.org/wiki/Unary_numeral_system), the binary data is encoded in the length of the string. For example, the single byte 0x11 is encoded as the 18-character string "AAAAAAAAAAAAAAAAAA", and a 140-character Tweet filled entirely with "A" characters decodes to the single-byte sequence 0x8B.

Base1 is not the most inefficient possible binary encoding, but it is a positive step in that direction: 1MB of input yields approximately 2<sup>8172</sup>MB of output.

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

For the purposes of this encoding, all possible [`Buffer`](https://nodejs.org/api/buffer.html#buffer_new_buffer_str_encoding)s are divided into blocks. There is 1 possible 0-byte buffer, 256 possible 1-byte buffers, 65,536 possible 2-byte buffers, 16,777,216 possible 3-byte buffers and so on.

### encodeL and decodeL

The methods `encodeL` and `decodeL` map buffers to Base1 string lengths. An empty buffer is mapped to length 0, 1-byte buffers are mapped to lengths from 1 to 256 inclusive, 2-byte buffers are mapped to lengths from 257 to 65,792 inclusive, 3-byte buffers are mapped to lengths from 65,793 to 16,843,008 inclusive, and so on.

The maximum safe integer in JavaScript is [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) = 9007199254740991, which corresponds to the 7-byte sequence 0x1E 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE. Passing 0x1E 0xFE 0xFE 0xFE 0xFE 0xFE 0xFF or a longer or "greater" buffer to `encodeL` results in an error; passing 9007199254740992 or higher to `decodeL` causes a similar error.

### encode and decode

The method `encode` calls `encodeL` to get a length `l`, then returns a string which is `l` repetitions of "A" in a row. `decode` reverses this process. An empty buffer is mapped to the empty string, 1-byte buffers are mapped to the strings "A" to "AAAAA...A" (256 characters) inclusive, and so on.

Here the upper limits are much lower and possibly platform-dependent. JavaScript specifies no maximum length for a string, although MDN's polyfill for [`String.prototype.repeat`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) gives an upper limit of 2<sup>28</sup> - 1 = 268,435,455 characters. This is equivalent to the 4-byte sequence 0x0E 0xFE 0xFE 0xFE. Larger or "greater" buffers may raise errors and longer strings may not even be constructible. Note that `base1` performs no explicit checks here; it is assumed that the underlying JavaScript engine will instead.
