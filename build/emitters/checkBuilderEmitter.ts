import Emitter from "./emitter";
import Tree from "../ast/tree";
import StringBuffer from "./stringBuffer";

export default class CheckBuilderEmitter implements Emitter {
	emit(tree: Tree, buffer: StringBuffer) {
		buffer
			.indent(0).append("const buildPropTypeCheck = func => {").newline()
			.indent(1).append("let wrapped = (props, propName, componentName) => {").newline()
			.indent(2).append("if (props[propName]) {").newline()
			.indent(3).append("let response = func(props[propName], propName, componentName || \"ANONYMOUS\");").newline()
			.indent(3).append("if (typeof response === \"string\") return new Error(response);").newline()
			.indent(3).append("if (response === undefined) return null;").newline()
			.indent(3).append("return response;").newline()
			.indent(2).append("}").newline()
			.indent(1).append("};").newline()
			.indent(1).append("wrapped.isRequired = (props, propName, componentName) => {").newline()
			.indent(2).append("if (props[propName] == null) return new Error(`${propName} in ${componentName || \"ANONYMOUS\"} is required`);").newline()
			.indent(2).append("return wrapped(props, propName, componentName);").newline()
			.indent(1).append("};").newline()
			.indent(1).append("return wrapped;").newline()
			.indent(0).append("};").newline().newline();
	}
}