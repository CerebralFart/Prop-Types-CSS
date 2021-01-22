import Definition from "../definitions/definition";
import makeDefinition from "../definitions/index";
import BranchRegister from "./branchRegister";

export default class Tree {
	private static flags = {
		"caseInsensitive": varName => `${varName} = ${varName}.toLowerCase()`,
	};

	public static merge(...trees: Tree[]) {
		const root = Tree.makeRoot();
		for (let tree of trees) {
			root._branches = BranchRegister.merge(root._branches, tree._branches);
			root._leaves.push(...tree._leaves);
		}
		return root;
	}

	public static makeRoot() {
		return new Tree(null, null);
	}

	readonly parent: Tree | null;
	private _name: string | null;
	private _branches: BranchRegister = new BranchRegister();
	private _leaves: Definition[] = [];
	private _flags: string[] = [];

	private constructor(name: string, parent: Tree) {
		this._name = name;
		this.parent = parent;
	}

	get name() {
		return this._name;
	}

	get branches() {
		return this._branches.items();
	}

	get leaves() {
		return [...this._leaves];
	}

	get flags() {
		const flagNames = [];
		let tree: Tree = this;
		while (tree != null) {
			flagNames.push(...tree._flags);
			tree = tree.parent;
		}
		return flagNames.map(flag => Tree.flags[flag]);
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
			return this._branches.get(step).get(path);
		} else {
			return this;
		}
	}

	public growBranch(name: string): Tree {
		const branch = new Tree(name, this);
		this._branches.add(branch);
		return branch;
	}

	public growLeaves(): void {
		this.iterate((tree: Tree) => {
			if (tree.isTerminus) {
				tree.makeLeaf();
			} else {
				tree.initializeFlags();
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
		this._branches.iterate(branch => branch.iterate(iterator, selfLeading));
		if (!selfLeading) iterator(this);
	}

	private makeLeaf(): void {
		if (!this.isTerminus) throw new Error(`Cannot grow a leaf on a non-terminus branch (${this.fullname.join(" - ")})`);
		this.parent._leaves.push(makeDefinition(this.name, this.root));
		this.parent._branches.remove(this);
	}

	private initializeFlags(): void {
		if (this._name === null) return; // Trees without name cannot have flags

		const match = this._name.match(/(.*)\[([a-zA-Z,]+)]/);
		if (match === null) return; // This tree doesn't have flags, abort parsing

		this._name = match[1];
		const flags = match[2].split(",");
		flags.forEach(flag => {
			if (!(flag in Tree.flags)) {
				throw new Error(`Flag '${flag}' is invalid`);
			}
		});
		this._flags = flags;
	}
}