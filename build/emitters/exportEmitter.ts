import Emitter from "./emitter";
import Tree from "../ast/tree";
import StringBuffer from "./stringBuffer";

export default class ExportEmitter implements Emitter {
	emit(tree: Tree, buffer: StringBuffer) {
		tree.iterate(tree => {
			if (tree.name === null) return;
			buffer.append(`module.exports.${tree.fullname.join(".")} = buildPropTypeCheck((value, prop, component) => ${tree.isFnName}(value) ? null : \`\${prop} in \${component} is not a valid css ${tree.fullname.join(" ")}\`);\n`);
		}, true);

		buffer.newline();

		tree.iterate(tree => {
			if (tree.name === null) return;
			buffer.append(`module.exports.${tree.isFnName} = ${tree.isFnName};\n`);
		});
	}
}