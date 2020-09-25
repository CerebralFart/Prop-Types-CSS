import Definition from "./definition";
import Tree from "../ast/tree";

export default class RegexDefinition extends Definition {
	readonly regex: string;

	constructor(definition: string, context: Tree) {
		super(context);
		if (!definition.startsWith("/")) throw new Error(`Cannot create a regex definition, missing starting slash`);
		if (!definition.endsWith("/")) throw new Error(`Cannot create a regex definition, missing terminating slash`);
		if (definition.indexOf(">") > -1 || definition.indexOf("<") > -1) throw new Error(`Cannot create a regular regex definition with references`);
		this.regex = definition.substr(1, definition.length - 2);
	}

	public compile(varName: string): string {
		return `\tif (${varName}.match(/^${this.regex}$/)) return true;`;//TODO
	}

	public toString() {
		return `regex        /${this.regex}/`;
	}
}