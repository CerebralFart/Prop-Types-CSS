import Tree from "./tree";

export default class Buffer {
	readonly root: Tree;
	private trees: Tree[] = [];

	constructor() {
		this.root = Tree.makeRoot();
	}

	public createTree(depth: number, name: string): Tree {
		if (depth < 0) throw new Error(`Cannot create a buffered tree at a negative depth`);
		if (depth > this.trees.length) throw new Error(`Cannot create a buffered tree at depth ${depth}, max depth is currently ${this.trees.length}`);

		if (this.trees.length > depth + 1) {
			for (let i = this.trees.length - 1; i > depth; i--) {
				this.trees.pop();
			}
		}

		const parent = depth > 0 ? this.trees[depth - 1] : this.root;
		const tree = parent.growBranch(name);
		this.trees[depth] = tree;

		return tree;
	}
}