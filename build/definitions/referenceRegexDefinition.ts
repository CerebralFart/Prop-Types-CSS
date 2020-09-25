import Definition from "./definition";
import Tree from "../ast/tree";
import RegexDefinition from "./regexDefinition";
import LiteralDefinition from "./literalDefinition";
import makeDefinition from "./index";
import StringBuffer from "../emitters/stringBuffer";

export default class ReferenceRegexDefinition extends Definition {
	private static labelCounter = 0;
	//TODO this breaks when the regex already has capturing groups
	private references: string[] = [];
	private unmapped: string;

	constructor(definition: string, context: Tree) {
		super(context);
		if (!definition.startsWith("/")) throw new Error(`Cannot create a regex definition, missing starting slash`);
		if (!definition.endsWith("/")) throw new Error(`Cannot create a regex definition, missing terminating slash`);
		if (definition.indexOf(">") < 0 && definition.indexOf("<") < 0) throw new Error(`Cannot create a reference regex definition with references`);

		this.references = Array.from(definition.matchAll(/<([a-z]+(\.[a-z]+)*)>/g), m => m[1]);
		this.unmapped = definition;
	}

	get regex() {
		let definition = this.unmapped;
		for (let reference of this.references) {
			definition = definition.replace(`<${reference}>`, "(.*)");
		}
		return definition.substr(1, definition.length - 2);
	}

	public optimize(): Definition[] {
		const references = this.references.map(ref => this.context.get(ref));

		for (let reference of references) {
			if (reference.branches.length > 0) continue;

			let acceptableTypes = true;
			for (let definition of reference.leaves) {
				if (!(definition instanceof RegexDefinition || definition instanceof LiteralDefinition)) {
					acceptableTypes = false;
				}
			}
			if (!acceptableTypes) continue;

			return reference.leaves.map(definition => {
				let replacement = "";
				if (definition instanceof LiteralDefinition) {
					replacement = definition.value;
				} else if (definition instanceof RegexDefinition) {
					replacement = definition.regex;
				}
				const newDef = this.unmapped.replace(`<${reference.name}>`, replacement);
				return makeDefinition(newDef, this.context);
			});
		}

		return null;
	}

	public compile(varName: string): string {
		const label = `lbl_rrd_${ReferenceRegexDefinition.labelCounter++}`;
		const buffer = new StringBuffer();
		buffer
			.append(`\t${label}:{\n`)
			.append(`\t\tlet match = ${varName}.match(/^${this.regex}$/);\n`)
			.append(`\t\tif (match === null) break ${label};\n`);
		this.references.forEach((ref, idx) => {
			const fn = this.context.get(ref).isFnName;
			buffer.append(`\t\tif (!${fn}(match[${idx + 1}])) break ${label};\n`);
		});
		buffer
			.append("\t\treturn true;\n")
			.append("\t}");
		return buffer.toString();
	}

	public toString() {
		return `regex-ref    /${this.regex}/  [${this.references.join(", ")}]`;
	}
}