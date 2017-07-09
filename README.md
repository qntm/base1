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
var base1 = require("base1");

var buf = new Buffer([0x03, 0xC0]); 

var l   = base1.encodeL(buf); // 1217
var str = base1.encode(buf);  // "AAAAAAAAAAAA...AA", string is 1,217 characters long

var buf2 = base1.decode(str); // <Buffer 03 c0>
var buf3 = base1.decodeL(l);  // <Buffer 03 c0>
```

## API

### base1.encodeL(buf)

Input a `Buffer`. Returns a Base1 string length (i.e. a non-negative integer). If this number cannot be represented as a JavaScript number, which is increasingly likely as buffer length increases, returns a string containing its decimal digits.

* The first buffer for which a string is returned is the 7-byte sequence 0x1E 0xFE 0xFE 0xFE 0xFE 0xFF 0x00, which returns the string `"9007199254740993"`.
* The last buffer for which a number is returned is the 128-byte sequence 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xF6 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFE 0xFF 0x00, which returns `Number.MAX_VALUE` = 2<sup>1024</sup> - 2<sup>971</sup> = 179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858369.

### base1.encode(buf)

Encodes a `Buffer` as a Base1 string. This method calls `base1.encodeL` to get a length `l` and then returns a string which is `l` repetitions of "A" in a row.

JavaScript specifies no maximum length for a string, although MDN's polyfill for [`String.prototype.repeat`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) gives an upper limit of 2<sup>28</sup> - 1 = 268,435,455 characters. This is equivalent to the 4-byte sequence 0x0E 0xFE 0xFE 0xFE. Buffers which are longer or lexicographically greater than this may cause errors in your JavaScript engine.

### base1.decodeL(l)

Take a Base1 string length in the form of a non-negative integer, a non-negative integer expressed as a decimal string or a `big-integer` object and return the `Buffer` it represents.

### base1.decode(str)

Decode a Base1 string and return the `Buffer` it represents.

## Ports

This is a JavaScript implementation of the Base1 encoding. It has also been ported:

* [C](https://github.com/girst/base1)
