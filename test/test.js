/* eslint-env mocha */

import assert from 'assert'
import fs from 'fs'
import { encodeL, encode, decodeL, decode } from '../src/index.js'

describe('base1', () => {
  describe('encodeL and decodeL', () => {
    describe('encodeL', () => {
      it('works', () => {
        assert.deepStrictEqual(encodeL(Uint8Array.from([])), 0n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0])), 1n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([17])), 18n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([255])), 256n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0, 0])), 257n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([255, 255])), 65792n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0, 0, 0])), 65793n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([255, 255, 255])), 16843008n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0, 0, 0, 0])), 16843009n)
      })

      it('edge cases', () => {
        assert.deepStrictEqual(encodeL(Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])), BigInt(Number.MAX_SAFE_INTEGER))
        assert.deepStrictEqual(encodeL(Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])), 9007199254740991n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF])), 9007199254740992n)
        assert.deepStrictEqual(encodeL(Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF, 0x00])), 9007199254740993n)

        // One below Number.MAX_VALUE
        assert.deepStrictEqual(encodeL(Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xF6, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])), BigInt(Number.MAX_VALUE) - 1n)

        // Exactly Number.MAX_VALUE
        assert.deepStrictEqual(encodeL(Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xF6, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF])), BigInt(Number.MAX_VALUE))

        // One above Number.MAX_VALUE
        assert.deepStrictEqual(encodeL(Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xF6, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF, 0x00])), BigInt(Number.MAX_VALUE) + 1n)
      })
    })

    describe('decodeL', () => {
      it('wants a non-negative BigInt', () => {
        assert.throws(() => decodeL(8), Error('This is not a non-negative BigInt'))
        assert.throws(() => decodeL(-1n), Error('This is not a non-negative BigInt'))
      })

      it('works', () => {
        assert.deepStrictEqual(decodeL(0n), Uint8Array.from([]))
        assert.deepStrictEqual(decodeL(1n), Uint8Array.from([0]))
        assert.deepStrictEqual(decodeL(18n), Uint8Array.from([17]))
        assert.deepStrictEqual(decodeL(256n), Uint8Array.from([255]))
        assert.deepStrictEqual(decodeL(257n), Uint8Array.from([0, 0]))
        assert.deepStrictEqual(decodeL(65792n), Uint8Array.from([255, 255]))
        assert.deepStrictEqual(decodeL(65793n), Uint8Array.from([0, 0, 0]))
        assert.deepStrictEqual(decodeL(16843008n), Uint8Array.from([255, 255, 255]))
        assert.deepStrictEqual(decodeL(16843009n), Uint8Array.from([0, 0, 0, 0]))
      })

      it('edge cases', () => {
        assert.deepStrictEqual(decodeL(BigInt(Number.MAX_SAFE_INTEGER)), Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE]))
        assert.deepStrictEqual(decodeL(9007199254740991n), Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE]))
        assert.deepStrictEqual(decodeL(9007199254740992n), Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF]))
        assert.deepStrictEqual(decodeL(9007199254740993n), Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF, 0x00]))

        assert.deepStrictEqual(decodeL(BigInt(Number.MAX_VALUE)), Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xF6, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF]))
      })
    })

    describe('round trips', () => {
      it('work', () => {
        assert.deepStrictEqual(decodeL(encodeL(new Uint8Array(10).fill(1))), new Uint8Array(10).fill(1))
        assert.deepStrictEqual(decodeL(encodeL(new Uint8Array(100).fill(1))), new Uint8Array(100).fill(1))
        assert.deepStrictEqual(decodeL(encodeL(new Uint8Array(1000).fill(1))), new Uint8Array(1000).fill(1))
        assert.deepStrictEqual(decodeL(encodeL(new Uint8Array(10000).fill(1))), new Uint8Array(10000).fill(1))
      })
    })
  })

  describe('encode and decode', () => {
    describe('encode', () => {
      it('throws on a bad BigInt length', () => {
        assert.throws(() => encode(Uint8Array.from([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF, 0x00])), Error('Could not compute the Base1 output length as a number'))
      })

      it('throws on too large an input', () => {
        assert.throws(() => encode(Uint8Array.from([0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xF6, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF])), RangeError('Invalid string length'))
      })
    })

    describe('round trips', () => {
      const pairsDir = './test/pairs'
      fs.readdirSync(pairsDir)
        .filter(fileName => fileName.endsWith('.base1'))
        .forEach(fileName => {
          const caseName = fileName.substring(0, fileName.length - '.base1'.length)
          it(caseName, () => {
            const base1 = fs.readFileSync(pairsDir + '/' + caseName + '.base1', 'utf8')
            const binary = Uint8Array.from(fs.readFileSync(pairsDir + '/' + caseName + '.bin'))
            assert.deepStrictEqual(decode(base1), binary)
            assert.deepStrictEqual(encode(binary), base1)
          })
        })
    })

    describe('invalid Base1', () => {
      const badDir = './test/bad'
      fs.readdirSync(badDir)
        .filter(fileName => fileName.endsWith('.base1'))
        .forEach(fileName => {
          const caseName = fileName.substring(0, fileName.length - '.base1'.length)
          it(caseName, () => {
            const base1 = fs.readFileSync(badDir + '/' + caseName + '.base1', 'utf8')
            assert.throws(() => decode(base1), Error('This is not a valid Base1 string'))
          })
        })
    })
  })
})
