/**
	Converts binary data to and from Base1, whereby the original binary is
	converted to an integer `n` and then a string of `n` repetitions of "A".
	E.g. base1.encode(new Buffer([17])) = "AAAAAAAAAAAAAAAAAA".
*/

var bigInteger = require("big-integer");

var base = bigInteger(1 << 8);

module.exports  = {
	/** Encode a buffer as a length `l` */
	encodeL: function(buf) {
		// First turn binary data into an integer
		var l = bigInteger(0);
		for(var i = 0; i < buf.length; i++) {
			var b = buf[i];
			l = l.times(base).plus(b);
		}

		// Next we need to determine the block.
		// Binary of length 0 bytes gives Base1 of length 0 ("")
		// Binary of length 1 byte gives Base1 of length 1 ("A") to 256 inclusive
		// Binary of length 2 bytes gives Base1 of length 257 to 65792 inclusive
		// etc.
		var binaryLength = 0, blockSize = base.pow(binaryLength);
		while(binaryLength < buf.length) {
			l = l.plus(blockSize);
			binaryLength++;
			blockSize = blockSize.times(base);
		}

		var number = l.toJSNumber(); // This may lose information.
		if (bigInteger(number.toString(2), 2).equals(l)) {
			return number;
		}

		return l.toString(10);
	},

	encode: function(buf) {
		return "A".repeat(this.encodeL(buf));
	},

	/** Operates on a length `l` */
	decodeL: function(l) {
		if(typeof l === 'number' && l > Number.MAX_SAFE_INTEGER) {
			// Apparently `bigInteger` does not preserve all the decimal digits! So
			// use this hack at construction time
			l = bigInteger(l.toString(2), 2);
		} else {
			l = bigInteger(l);
		}

		// First we need to work out the length in bytes of the original binary.
		// Base1 of length 0 ("") means binary is 0 bytes long.
		// Base1 of length 1 ("A") to 256 inclusive means binary is 1 byte long.
		// Base1 of length 257 to 65792 inclusive means binary is 2 bytes long.
		// Base1 of length 65793 to 16843008 inclusive means binary is 3 bytes long.
		// etc.
		var binaryLength = 0, blockSize = base.pow(binaryLength);
		while(l.greaterOrEquals(blockSize)) {
			l = l.minus(blockSize);
			binaryLength++;
			blockSize = blockSize.times(base);
		}

		// `l` is now the offset into the block, a number from 0 to
		// 256 ** `binaryLength` - 1 inclusive. We can populate the buffer from the
		// number now.
		var buf = new Buffer(binaryLength);
		for(var byteNum = binaryLength - 1; byteNum >= 0; byteNum--) {
			var b = l.mod(base);
			buf[byteNum] = b.toJSNumber();
			l = l.minus(b).divide(base);
		}
		return buf;
	},

	decode: function(base1) {
		// Got to make sure every character is "A". TODO: PERFORMANCE???
		var l = base1.length;
		for(var i = 0; i < l; i++) {
			if(base1.charAt(i) !== "A") {
				throw new Error("This is not a valid Base1 string");
			}
		}
		return this.decodeL(l);
	}
};
