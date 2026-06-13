/**
 * Base1 encoder — converts binary data to a unary representation.
 *
 * The encoding works by interpreting the input bytes as a single BigInt
 * (big-endian, with each byte offset by +1 to avoid leading zeros being
 * lost), then representing that value as a string of repeated "A" characters
 * whose count equals the BigInt value.
 *
 * @example
 * encodeL(Uint8Array.from([17])) // => 18n
 * encode(Uint8Array.from([17]))  // => "AAAAAAAAAAAAAAAAAA"
 */

/**
 * Compute the unary length (BigInt) for a Uint8Array input.
 *
 * Each byte contributes to the result as: L = L * 256 + byte + 1.
 * The +1 offset ensures that empty input maps to 0n (not 0 bytes of output),
 * and byte 0x00 maps to 1n (not 0n), so no information is lost.
 *
 * @param {Uint8Array} uint8Array - The binary data to encode.
 * @returns {bigint} The unary length representing the input.
 */
export const encodeL = uint8Array =>
  uint8Array.reduce((unaryLength, byte) => unaryLength * 256n + BigInt(byte) + 1n, 0n)

/**
 * Encode a Uint8Array as a Base1 string (repeated "A" characters).
 *
 * The output string length equals the unary length computed by encodeL.
 * Throws if the resulting string would exceed Number.MAX_SAFE_INTEGER
 * (since String.prototype.repeat requires a Number, not a BigInt).
 *
 * @param {Uint8Array} uint8Array - The binary data to encode.
 * @returns {string} A string of "A" characters whose count equals the encoded value.
 * @throws {Error} If the BigInt length cannot be losslessly converted to a Number.
 * @throws {RangeError} If the resulting string exceeds the JS engine's string length limit.
 */
export const encode = uint8Array => {
  const unaryLength = encodeL(uint8Array)

  // String.prototype.repeat demands a number, not a BigInt
  const lengthAsNumber = Number(unaryLength) // This can lose information
  if (BigInt(lengthAsNumber) !== unaryLength) {
    throw Error('Could not compute the Base1 output length as a number')
  }

  // This could still throw, JS specifies no string length limit
  return 'A'.repeat(lengthAsNumber)
}
