import Tree from "../ast/tree";

export default abstract class Definition {
	private _context: Tree;

	constructor(context: Tree) {
		this._context = context;
	}

	updateContext(context: Tree): void {
		this._context = context;
	}

	get context(): Tree {
		return this._context;
	}

	optimize(): Definition[] | null {
		return null;
	}

	abstract compile(varName: string): string;
}