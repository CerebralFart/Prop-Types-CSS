const test = require("ava");
const ptc = require("../dist/index");

interface Case {
	valid: string[];
	invalid: string[];
}

const cases: { [key: string]: Case } = {
	angle: {
		valid: ["90deg", "-270deg", "1turn", "4turn", "0"],
		invalid: [],
	},
	integer: {
		valid: ["12", "+123", "-456", "0", "+0", "-0"],
		invalid: ["12.0", "12.", "+---12", "ten", "_5", "\\35", "\\4E94", "3e4"],
	},
	time: {
		valid: ["12s", "-456ms", "4.3ms", "14mS", "+0s", "-0ms"],
		invalid: ["0", "12.0", "7 ms"],
	},
};

for (let testCase in cases) {
	test(`${testCase} grammar test`, t => {
		const {valid, invalid} = cases[testCase];
		const isFnName = `is${testCase.charAt(0).toUpperCase()}${testCase.substr(1)}`;
		t.is(typeof ptc[isFnName], "function");
		valid.forEach(v => t.true(ptc[isFnName](v), `'${v}' should be considered a valid ${testCase}`));
		invalid.forEach(v => t.false(ptc[isFnName](v), `${v} should not be considered a valid ${testCase}`));
	});
}