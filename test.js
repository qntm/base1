/** Tests for base65536, ensure strings survive round trips, etc. */

var base1 = require("./index.js");

console.log(base1.encodeL(new Buffer([                ])) ===        0);
console.log(base1.encodeL(new Buffer([               0])) ===        1);
console.log(base1.encodeL(new Buffer([              17])) ===       18);
console.log(base1.encodeL(new Buffer([             255])) ===      256);
console.log(base1.encodeL(new Buffer([          0,   0])) ===      257);
console.log(base1.encodeL(new Buffer([        255, 255])) ===    65792);
console.log(base1.encodeL(new Buffer([     0,   0,   0])) ===    65793);
console.log(base1.encodeL(new Buffer([   255, 255, 255])) === 16843008);
console.log(base1.encodeL(new Buffer([0,   0,   0,   0])) === 16843009);

console.log(base1.encode(new Buffer([                ])) === "A".repeat(       0));
console.log(base1.encode(new Buffer([               0])) === "A".repeat(       1));
console.log(base1.encode(new Buffer([              17])) === "AAAAAAAAAAAAAAAAAA");
console.log(base1.encode(new Buffer([             255])) === "A".repeat(     256));
console.log(base1.encode(new Buffer([          0,   0])) === "A".repeat(     257));
console.log(base1.encode(new Buffer([        255, 255])) === "A".repeat(   65792));
console.log(base1.encode(new Buffer([     0,   0,   0])) === "A".repeat(   65793));
console.log(base1.encode(new Buffer([   255, 255, 255])) === "A".repeat(16843008));
console.log(base1.encode(new Buffer([0,   0,   0,   0])) === "A".repeat(16843009));

console.log(base1.decodeL(       0).equals(new Buffer([                ])));
console.log(base1.decodeL(       1).equals(new Buffer([               0])));
console.log(base1.decodeL(      18).equals(new Buffer([              17])));
console.log(base1.decodeL(     256).equals(new Buffer([             255])));
console.log(base1.decodeL(     257).equals(new Buffer([          0,   0])));
console.log(base1.decodeL(   65792).equals(new Buffer([        255, 255])));
console.log(base1.decodeL(   65793).equals(new Buffer([     0,   0,   0])));
console.log(base1.decodeL(16843008).equals(new Buffer([   255, 255, 255])));
console.log(base1.decodeL(16843009).equals(new Buffer([0,   0,   0,   0])));

console.log(base1.decode("A".repeat(       0)).equals(new Buffer([                ])));
console.log(base1.decode("A".repeat(       1)).equals(new Buffer([               0])));
console.log(base1.decode("AAAAAAAAAAAAAAAAAA").equals(new Buffer([              17])));
console.log(base1.decode("A".repeat(     256)).equals(new Buffer([             255])));
console.log(base1.decode("A".repeat(     257)).equals(new Buffer([          0,   0])));
console.log(base1.decode("A".repeat(   65792)).equals(new Buffer([        255, 255])));
console.log(base1.decode("A".repeat(   65793)).equals(new Buffer([     0,   0,   0])));
console.log(base1.decode("A".repeat(16843008)).equals(new Buffer([   255, 255, 255])));
console.log(base1.decode("A".repeat(16843009)).equals(new Buffer([0,   0,   0,   0])));

// B
["B", "AAAB", "A A", "BAAA"].forEach(function(badBase1) {
	try {
		base1.decode(badBase1);
		console.log(false);
	} catch(e) {
		console.log(true);
	}
});

// Edge cases for encodeL and decodeL
console.log(base1.encodeL(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])) === Number.MAX_SAFE_INTEGER);
try {
	base1.encodeL(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF]));
	console.log(false);
} catch(e) {
	console.log(true);
}
console.log(base1.decodeL(Number.MAX_SAFE_INTEGER).equals(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])));
try {
	base1.decodeL(Number.MAX_SAFE_INTEGER + 1);
	console.log(false);
} catch(e) {
	console.log(true);
}

// Edge cases for encode and decode


console.log("OK");