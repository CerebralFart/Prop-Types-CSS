import Definition from "./Definition";
import LiteralDefinition from "./LiteralDefinition";

const definitions = [
	LiteralDefinition,
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