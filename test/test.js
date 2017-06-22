/** Tests for base65536, ensure strings survive round trips, etc. */

var base1 = require("../index.js");
var fs = require("fs");

console.log(base1.encodeL(new Buffer([                ])) ===        0);
console.log(base1.encodeL(new Buffer([               0])) ===        1);
console.log(base1.encodeL(new Buffer([              17])) ===       18);
console.log(base1.encodeL(new Buffer([             255])) ===      256);
console.log(base1.encodeL(new Buffer([          0,   0])) ===      257);
console.log(base1.encodeL(new Buffer([        255, 255])) ===    65792);
console.log(base1.encodeL(new Buffer([     0,   0,   0])) ===    65793);
console.log(base1.encodeL(new Buffer([   255, 255, 255])) === 16843008);
console.log(base1.encodeL(new Buffer([0,   0,   0,   0])) === 16843009);

console.log(base1.decodeL(       0).equals(new Buffer([                ])));
console.log(base1.decodeL(       1).equals(new Buffer([               0])));
console.log(base1.decodeL(      18).equals(new Buffer([              17])));
console.log(base1.decodeL(     256).equals(new Buffer([             255])));
console.log(base1.decodeL(     257).equals(new Buffer([          0,   0])));
console.log(base1.decodeL(   65792).equals(new Buffer([        255, 255])));
console.log(base1.decodeL(   65793).equals(new Buffer([     0,   0,   0])));
console.log(base1.decodeL(16843008).equals(new Buffer([   255, 255, 255])));
console.log(base1.decodeL(16843009).equals(new Buffer([0,   0,   0,   0])));

// Edge cases for encodeL and decodeL
console.log(base1.encodeL(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])) === Number.MAX_SAFE_INTEGER);
console.log(base1.encodeL(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])) === 9007199254740991);
console.log(base1.encodeL(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF])) === "9007199254740992");

console.log(base1.decodeL(Number.MAX_SAFE_INTEGER).equals(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])));
console.log(base1.decodeL(9007199254740991).equals(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE])));
console.log(base1.decodeL("9007199254740992").equals(new Buffer([0x1E, 0xFE, 0xFE, 0xFE, 0xFE, 0xFE, 0xFF])));
try {
	base1.decodeL(Number.MAX_VALUE);
	console.log(false);
} catch(e) {
	console.log(true);
}

console.log(base1.decodeL("0").equals(new Buffer([])));
console.log(base1.decodeL(base1.encodeL(Buffer.alloc(1000, 1))).equals(Buffer.alloc(1000, 1)));
console.log(base1.decodeL(base1.encodeL(Buffer.alloc(10000, 1))).equals(Buffer.alloc(10000, 1)));
console.log();

// encode, decode

var pairsDir = "./test/pairs";
fs.readdirSync(pairsDir).forEach(function(fileName) {
	if(!fileName.endsWith(".base1")) {
		return;
	}
	var caseName = fileName.substring(0, fileName.length - ".base1".length);
	var base1Text = fs.readFileSync(pairsDir + "/" + caseName + ".base1", "utf8");
	var binary = fs.readFileSync(pairsDir + "/" + caseName + ".bin");
	console.log(base1.decode(base1Text).equals(binary));
	console.log(base1.encode(binary) === base1Text);
});

var badDir = "./test/bad";
fs.readdirSync(badDir).forEach(function(fileName) {
	if(!fileName.endsWith(".base1")) {
		return;
	}
	var caseName = fileName.substring(0, fileName.length - ".base1".length);
	var base1Text = fs.readFileSync(badDir + "/" + caseName + ".base1", "utf8");
	try {
		base1.decode(base1Text);
		console.log(false);
	} catch(e) {
		console.log(true);
	}
});

console.log("OK");
