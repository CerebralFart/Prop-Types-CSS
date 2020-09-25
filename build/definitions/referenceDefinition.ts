import Definition from "./definition";
import Tree from "../ast/tree";

export default class ReferenceDefinition extends Definition {
	readonly reference: string;

	constructor(definition: string, context: Tree) {
		super(context);
		if (!definition.startsWith("<")) throw new Error(`Reference definitions should start with an opening angle bracket`);
		if (!definition.endsWith(">")) throw new Error(`Reference definitions should end with a closing angle bracket`);
		this.reference = definition.substr(1, definition.length - 2);
		if (this.reference.indexOf(">") > -1) throw new Error(`Reference definitions cannot contain angle brackets`);
		if (this.reference.indexOf("<") > -1) throw new Error(`Reference definitions cannot contain angle brackets`);
	}

	public optimize(): Definition[] | null {
		const reference = this.context.get(this.reference);
		return reference.branches.length === 0 ? reference.leaves : null;
	}

	public compile(varName: string): string {
		const reference = this.context.get(this.reference);
		return `\tif (${reference.isFnName}(${varName})) return true;`;
	}

	public toString() {
		return `reference    ${this.reference}`;
	}
}