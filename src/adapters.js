// adapters.js — adapter functions wrapping BigInt-based base1 functions
// for fingerprint compatibility (BigInt cannot be JSON-serialized)
import { encodeL } from './encode.js'
import { decodeL } from './decode.js'

/**
 * encodeL adapter: converts Uint8Array to a string representation of the BigInt result.
 * This makes the output JSON-serializable for fingerprint capture.
 *
 * @param {Uint8Array} uint8Array - The binary data to encode.
 * @returns {string} String representation of the unary length BigInt.
 */
export const encodeLToString = uint8Array => String(encodeL(uint8Array))

/**
 * decodeL adapter: converts a string representation of a BigInt back to Uint8Array.
 * This makes the input JSON-serializable for fingerprint capture.
 *
 * @param {string} bigintStr - String representation of a non-negative BigInt.
 * @returns {Uint8Array} The decoded binary data.
 */
export const decodeLFromString = bigintStr => decodeL(BigInt(bigintStr))

// Re-export for Ghost Proxy watchability
export { encodeL, decodeL }
