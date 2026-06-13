// roundtrip.js — compose encode→decode for round-trip regression testing
import { encode } from './encode.js'
import { decode } from './decode.js'

/**
 * Round-trip test: encode then decode should return the original input.
 * Re-exports encode and decode for Ghost Proxy watchability.
 *
 * @param {Uint8Array} uint8Array - The binary data to round-trip.
 * @returns {Uint8Array} The same binary data after encode→decode.
 */
export const roundtrip = uint8Array => decode(encode(uint8Array))

// Re-export for Ghost Proxy watchability
export { encode, decode }
