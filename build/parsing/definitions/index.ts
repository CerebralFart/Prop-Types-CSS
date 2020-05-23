import Definition from "./Definition";
import RegexDefinition from "./RegexDefinition";
import LiteralDefinition from "./LiteralDefinition";

const definitions = [
	LiteralDefinition,
	RegexDefinition,
];

const buildDefinition = (value: string): Definition => {
	for (let type of definitions) {
		try {
			return new type(value);
		} catch (e) {
		}
	}
	throw new Error(`No definition could be built for '${value}'`);
};

export default buildDefinition;