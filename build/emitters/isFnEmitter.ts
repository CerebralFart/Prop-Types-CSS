import Emitter from "./emitter";
import StringBuffer from "./stringBuffer";
import Tree from "../ast/tree";
import LiteralDefinition from "../definitions/literalDefinition";

export default class IsFnEmitter extends Emitter {
	private static multiCompilers = [
		LiteralDefinition.multiCompile,
	];

	emit(tree: Tree, buffer: StringBuffer) {
		tree.iterate(subtree => {
			if (subtree.name === null) return;
			buffer.append(`const ${subtree.isFnName} = value => {\n`);
			subtree.flags.forEach(flag => buffer.indent().append(flag("value")).newline());

			let branchFns = subtree.branches
				.filter(branch => branch.isCascading)
				.map(branch => `${branch.isFnName}(value)`);
			if (branchFns.length > 0) {
				buffer.append(`\tif (${branchFns.join(" || ")}) return true;\n`);
			}

			let queue = [...subtree.leaves];

			for (let compiler of IsFnEmitter.multiCompilers) {
				queue = compiler("value", queue, buffer);
			}

			for (let definition of queue) {
				buffer.append(definition.compile("value")).newline();
			}

			buffer.append("\treturn false;\n");
			buffer.append("};\n");
		});

		buffer.newline();
	}
}