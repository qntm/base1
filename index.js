/**
	Converts binary data to and from Base1, whereby the original binary is
	converted to an integer `n` and then a string of `n` repetitions of "A".
	E.g. base1.encode(new Buffer([17])) = "AAAAAAAAAAAAAAAAAA".
*/

var base = Math.pow(2, 8);

module.exports  = {
	/** Encode a buffer as a length `l` */
	encodeL: function(buf) {
		// First turn binary data into an integer
		var l = 0;
		for(var b of buf) {
			l *= base;
			l += b;
		}

		// Next we need to determine the block.
		// Binary of length 0 bytes gives Base1 of length 0 ("")
		// Binary of length 1 byte gives Base1 of length 1 ("A") to 256 inclusive
		// Binary of length 2 bytes gives Base1 of length 257 to 65792 inclusive
		// etc.
		var binaryLength = 0, blockSize = Math.pow(base, binaryLength);
		while(binaryLength < buf.length) {
			l += blockSize;
			binaryLength++;
			blockSize *= base;
		}

		if(l > Number.MAX_SAFE_INTEGER) {
			throw new Error("Can't safely encode this buffer as a JavaScript number without losing information.");
		}

		return l;
	},

	encode: function(buf) {
		return "A".repeat(this.encodeL(buf));
	},

	/** Operates on a length `l` */
	decodeL: function(l) {
		if(l > Number.MAX_SAFE_INTEGER) {
			throw new Error("Can't safely decode this JavaScript number to a buffer without losing information.");
		}

		// First we need to work out the length in bytes of the original binary.
		// Base1 of length 0 ("") means binary is 0 bytes long.
		// Base1 of length 1 ("A") to 256 inclusive means binary is 1 byte long.
		// Base1 of length 257 to 65792 inclusive means binary is 2 bytes long.
		// Base1 of length 65793 to 16843008 inclusive means binary is 3 bytes long.
		// etc.
		var binaryLength = 0, blockSize = Math.pow(base, binaryLength);
		while(l >= blockSize) {
			l -= blockSize;
			binaryLength++;
			blockSize *= base;
		}

		// `l` is now the offset into the block, a number from 0 to
		// 256 ** `binaryLength` - 1 inclusive. We can populate the buffer from the
		// number now.
		var buf = new Buffer(binaryLength);
		for(var byteNum = binaryLength - 1; byteNum >= 0; byteNum--) {
			var b = l & (base - 1);
			buf[byteNum] = b;
			l -= b;
			l /= base;
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
