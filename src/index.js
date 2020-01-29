/**
  Converts binary data to and from Base1, whereby the original binary is
  converted to a BigInt `l` and then a string of `l` repetitions of "A".
  E.g. base1.encode(new Buffer([17])) = "AAAAAAAAAAAAAAAAAA".
*/

/* global BigInt */

export const encodeL = uint8Array =>
  uint8Array.reduce((l, b) => l * 256n + BigInt(b) + 1n, 0n)

export const encode = uint8Array => {
  const l = encodeL(uint8Array)

  // String.prototype.repeat demands a number, not a BigInt
  const number = Number(l) // This can lose information
  if (BigInt(number) !== l) {
    throw Error('Could not compute the Base1 output length as a number')
  }

  // This could still throw, JS specifies no string length limit
  return 'A'.repeat(number)
}

export const decodeL = l => {
  const bytes = []
  while (l > 0n) {
    l -= 1n
    bytes.push(Number(l % 256n))
    l /= 256n
  }

  bytes.reverse()
  return Uint8Array.from(bytes)
}

export const decode = base1 => {
  // TODO: performance?
  if (!/^A*$/.test(base1)) {
    throw Error('This is not a valid Base1 string')
  }

  return decodeL(BigInt(base1.length))
}
