import Tree from "../ast/tree";

export default abstract class Definition {
	readonly context: Tree;

	constructor(context: Tree) {
		this.context = context;
	}

	optimize(): Definition[] | null {
		return null;
	}

	abstract compile(varName: string): string;
}