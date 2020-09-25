import Definition from "./definition";
import LiteralDefinition from "./literalDefinition";
import ReferenceDefinition from "./referenceDefinition";
import RegexDefinition from "./regexDefinition";
import MultiReferenceDefinition from "./multiReferenceDefinition";
import ReferenceRegexDefinition from "./referenceRegexDefinition";
import Tree from "../ast/tree";

const types = [
	ReferenceDefinition,
	MultiReferenceDefinition,
	RegexDefinition,
	ReferenceRegexDefinition,
	LiteralDefinition,
];

const makeDefinition: (definition: string, context: Tree) => Definition = (definition, context) => {
	for (let type of types) {
		try {
			return new type(definition, context);
		} catch (e) {
		}
	}
	throw new Error(`No suitable definitions were found for '${definition}'`);
};

export default makeDefinition;