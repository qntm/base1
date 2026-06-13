/**
 * Base1 — Binary encoding inspired by unary numbers.
 *
 * Converts binary data to and from Base1, whereby the original binary is
 * converted to a BigInt `l` and then a string of `l` repetitions of "A".
 *
 * @example
 * base1.encode(Uint8Array.from([17])) // => "AAAAAAAAAAAAAAAAAA"
 * base1.decode("AAAAAAAAAAAAAAAAAA")  // => Uint8Array [17]
 *
 * @module base1
 */

export { encodeL, encode } from './encode.js'
export { decodeL, decode } from './decode.js'
