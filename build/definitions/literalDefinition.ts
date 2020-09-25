import Definition from "./definition";
import Tree from "../ast/tree";
import StringBuffer from "../emitters/stringBuffer";

export default class LiteralDefinition extends Definition {
	readonly value: string;

	public static multiCompile(varName: string, definitions: Definition[], buffer: StringBuffer): Definition[] {
		const literalDefs = <LiteralDefinition[]>definitions.filter(def => def instanceof LiteralDefinition);
		const literals = literalDefs.map(def => def.value);

		if (literals.length > 1) {
			const arr = literals.map(str => JSON.stringify(str)).join(", ");
			buffer.indent().append(`if ([${arr}].indexOf(${varName}) > -1) return true;`).newline();
			return definitions.filter(def => !(def instanceof LiteralDefinition));
		} else {
			return definitions;
		}
	}

	constructor(definition: string, context: Tree) {
		super(context);
		this.value = definition;
	}

	public compile(varName) {
		return `\tif (${varName} === "${this.value}") return true;`;
	}

	public toString(): string {
		return `literal      ${this.value}`;
	}
}