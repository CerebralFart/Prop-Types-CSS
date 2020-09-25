import Definition from "./definition";
import Tree from "../ast/tree";
import RegexDefinition from "./regexDefinition";
import StringBuffer from "../emitters/stringBuffer";

export default class MultiReferenceDefinition extends Definition {
	private static labelCounter = 0;

	readonly references: string[] = [];

	constructor(definition: string, context: Tree) {
		super(context);
		if (!definition.startsWith("<")) throw new Error(`Reference definitions should start with an opening angle bracket`);
		if (!definition.endsWith(">")) throw new Error(`Reference definitions should end with a closing angle bracket`);
		if (definition.indexOf("><") < 0) throw new Error(`Multi-ref definitions should contain at least two references`);
		this.references = definition.substr(1, definition.length - 2).split("><");
	}

	public optimize() {
		//TODO this can be implemented, but I can't be arsed right now. Tho, some of this might just be lifted from the compile functions
		return null;
	}

	public compile(varName: string): string {
		let trees = this.references.map(ref => this.context.get(ref));
		let sequentialNonLiftables = false;
		let regex = "";
		let refs = [];

		for (let tree of trees) {
			if (
				tree.leaves.length === 1 &&
				tree.leaves[0] instanceof RegexDefinition &&
				tree.branches.length === 0
			) {
				sequentialNonLiftables = false;
				const def = <RegexDefinition>tree.leaves[0];
				regex += def.regex;
			} else if (sequentialNonLiftables) {
				throw new Error(`Cannot parse Multi-reference definition <${this.references.join("><")}>, '${tree.fullname.join(".")}' follows an item that could not be lifted up.`);
			} else {
				sequentialNonLiftables = true;
				regex += "(.*)";
				refs.push(tree);
			}
		}

		const label = `lbl_mrd_${MultiReferenceDefinition.labelCounter}`;
		let out = new StringBuffer();

		out.append(`\t${label}:\{\n`)
			.append(`\t\tlet match = ${varName}.match(/^${regex}$/);\n`)
			.append(`\t\tif (match === null) break ${label};\n`);
		for (let i = 0; i < refs.length; i++) {
			out.append(`\t\tif (!${refs[i].isFnName}(match[${i + 1}])) break ${label};\n`);
		}
		out.append(`\t\treturn true;\n`)
			.append("\t}");

		return out.toString();
	}

	public toString() {
		return `multi-ref  ${this.references.join(", ")}`;
	}
}