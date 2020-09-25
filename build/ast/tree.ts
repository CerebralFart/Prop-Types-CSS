import Definition from "../definitions/definition";
import makeDefinition from "../definitions/index";

export default class Tree {
	public static merge(...trees: Tree[]) {
		const root = Tree.makeRoot();
		for (let tree of trees) {
			root._branches = {...root._branches, ...tree._branches};
			root._leaves.push(...tree._leaves);
		}
		return root;
	}

	public static makeRoot() {
		return new Tree(null, null);
	}

	readonly name: string | null;
	readonly parent: Tree | null;
	private _branches: { [key: string]: Tree } = {};
	private _leaves: Definition[] = [];

	private constructor(name: string, parent: Tree) {
		this.name = name;
		this.parent = parent;
	}

	get branches() {
		return Object.values(this._branches);
	}

	get leaves() {
		return [...this._leaves];
	}

	get isCascading() {
		return this.name === null || !this.name.startsWith("/");
	}

	get isTerminus() {
		return this.branches.length === 0 && this._leaves.length === 0;
	}

	get fullname() {
		if (this.name === null) return [];
		const name = this.parent.fullname;
		name.push(this.name.substr(this.isCascading ? 0 : 1));
		return name;
	}

	get isFnName() {
		return `is${this.fullname.map(v => v.charAt(0).toUpperCase() + v.substr(1)).join("")}`;
	}

	get root() {
		if (this.parent !== null) return this.parent.root;
		else return this;
	}

	public get(path: string | string[]): Tree {
		if (typeof path === "string") path = path.split(".");
		const step = path.shift();
		if (step) {
			let section = this._branches[step];
			if (!section) section = this._branches["/" + step];

			return section.get(path);
		} else {
			return this;
		}
	}

	public growBranch(name: string): Tree {
		const branch = new Tree(name, this);
		this._branches[name] = branch;
		return branch;
	}

	public growLeaves(): void {
		this.iterate((tree: Tree) => {
			if (tree.isTerminus) {
				tree.makeLeaf();
			}
		});
	}

	public optimize(): void {
		const newLeaves = [];
		this._leaves.forEach(leaf => {
			const unoptimizedLeaves = [leaf];
			while (unoptimizedLeaves.length > 0) {
				let option = unoptimizedLeaves.pop();
				let optimized = option.optimize();
				if (optimized === null) newLeaves.push(option);
				else unoptimizedLeaves.push(...optimized);
			}
		});
		this._leaves = newLeaves;
		this.branches.forEach(branch => branch.optimize());
	}

	public iterate(iterator: (tree: Tree) => void, selfLeading: boolean = false) {
		if (selfLeading) iterator(this);
		for (let name in this._branches) {
			let branch = this._branches[name];
			branch.iterate(iterator, selfLeading);
		}
		if (!selfLeading) iterator(this);
	}

	private replaceBranch(branchName: string, definition: Definition) {
		delete this._branches[branchName];
		this._leaves.push(definition);
	}

	private makeLeaf(): void {
		if (!this.isTerminus) throw new Error(`Cannot grow a leaf on a non-terminus branch (${this.fullname.join(" - ")})`);
		this.parent.replaceBranch(
			this.name,
			makeDefinition(this.name, this.root),
		);
	}
}