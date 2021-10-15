# CHANGELOG

## 2.0.0

* Dropped support for Node.js prior to 14.
* Dropped support for CommonJS modules. `base1` is now available solely as ES modules.
* There is no longer an IIFE for using in the browser... you can use browser-native ES module loading for this purpose.

## 1.x.x

`base1` now operates on `Uint8Array`s, not `Buffer`s.

## 0.1.x

Behaviour of `encodeL` has changed. Some buffers lexicographically greater than or equal to the 7-byte sequence 0x1E 0xFE 0xFE 0xFE 0xFE 0xFF 0x00 now return numbers instead of strings when the number is precisely accurate.

## 0.0.x

Prototype release.
