import StringBuffer from "./stringBuffer";
import Tree from "../ast/tree";

export default abstract class Emitter {
	abstract emit(tree: Tree, buffer: StringBuffer);
}
