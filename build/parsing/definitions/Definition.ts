import Tree from "../Tree";

abstract class Definition {
	abstract compile(varName: string, root: Tree, counter: number): string;
}

export default Definition;