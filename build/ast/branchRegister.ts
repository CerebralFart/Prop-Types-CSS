import Tree from "./tree";

class BranchRegister {
	public static merge(register1: BranchRegister, register2: BranchRegister): BranchRegister {
		const register = new BranchRegister();
		register1.iterate(branch => register.add(branch));
		register2.iterate(branch => register.add(branch));
		return register;
	}

	private _items: Tree[] = [];

	public add(subtree: Tree): void {
		this._items.push(subtree);
	}

	public remove(subtree: Tree): void {
		this._items = this._items.filter(tree => subtree !== tree);
	}

	public get(name: string): Tree {
		const results = this._items.filter(tree => {
			return this.normalizeName(tree.name) === name;
		});
		if (results.length === 0) {
			throw new Error(`No definitions exist for ${name}`);
		} else if (results.length === 1) {
			return results[0];
		} else {
			throw new Error(`Multiple definitions exist for ${name}`);
		}
	}

	public items() {
		return [...this._items];
	}

	public iterate(fn: (t: Tree) => void): void {
		this._items.forEach(fn);
	}

	private normalizeName(name: string): string {
		if (name.startsWith("/")) name = name.substr(1);
		if (name.includes("[")) name = name.substr(0, name.indexOf("["));

		return name;
	}
}

export default BranchRegister;