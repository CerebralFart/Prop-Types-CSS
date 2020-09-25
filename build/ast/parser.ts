import Buffer from "./buffer";
import Tree from "./tree";
import * as fs from "fs";

export default class Parser {
	static grammarDir = `${__dirname}/../../grammar/`;

	public static parseAll(): Tree {
		return Tree.merge(
			...fs.readdirSync(Parser.grammarDir)
				.map(Parser.parseFile),
		);
	}

	public static parseFile(file: string): Tree {
		if (!file.endsWith(".grmr")) file += ".grmr";
		const content = fs.readFileSync(Parser.grammarDir + file).toString();
		return Parser.parse(content);
	}

	private static parse(definition: string): Tree {
		const lines = definition.split("\n");
		const buffer = new Buffer();

		for (let line of lines) {
			const offset = line.match(/^\t*/)[0].length;
			const name = line.substr(offset);
			buffer.createTree(offset, name);
		}

		const {root} = buffer;
		root.growLeaves();
		return root;
	}
}