/**
 * Base1 decoder — converts unary representations back to binary data.
 *
 * The decoding reverses the encoding: a string of N "A" characters is
 * converted back to the BigInt N, then the original bytes are recovered
 * by repeatedly dividing by 256 (with -1 offset per byte).
 *
 * @example
 * decodeL(18n)                      // => Uint8Array [17]
 * decode("AAAAAAAAAAAAAAAAAA")      // => Uint8Array [17]
 */

/**
 * Decode a unary length (BigInt) back to a Uint8Array.
 *
 * Each byte is recovered by: byte = (L - 1) % 256, then L = (L - 1) / 256.
 * Bytes are collected in reverse order and then reversed.
 *
 * @param {bigint} unaryLength - The non-negative BigInt to decode.
 * @returns {Uint8Array} The decoded binary data.
 * @throws {Error} If the input is not a non-negative BigInt.
 */
export const decodeL = unaryLength => {
  if (typeof unaryLength !== 'bigint' || unaryLength < 0n) {
    throw Error('This is not a non-negative BigInt')
  }

  const bytes = []
  let remaining = unaryLength
  while (remaining > 0n) {
    remaining -= 1n
    bytes.push(Number(remaining % 256n))
    remaining /= 256n // rounds down
  }

  bytes.reverse()
  return Uint8Array.from(bytes)
}

/**
 * Decode a Base1 string (repeated "A" characters) back to a Uint8Array.
 *
 * Validates that the input consists only of "A" characters (or is empty),
 * then delegates to decodeL with the string length as a BigInt.
 *
 * @param {string} base1 - The Base1 string to decode (must match /^A*$/).
 * @returns {Uint8Array} The decoded binary data.
 * @throws {Error} If the input contains any character other than "A".
 */
export const decode = base1 => {
  if (!/^A*$/.test(base1)) {
    throw Error('This is not a valid Base1 string')
  }

  return decodeL(BigInt(base1.length))
}
