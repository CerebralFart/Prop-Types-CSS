import Command from "./command";
import yargs from "yargs";
import Parser from "../ast/parser";

export default class ExplainCommand implements Command {
	readonly name = "explain [section]";
	readonly description = "";

	configure(args: yargs.Argv) {
		//TODO [section] should explain a specific section of the spec, like length.
		return args
			.positional("section", {
				type: "string",
			})
			.option("optimize", {
				alias: "o",
			});
	}

	execute(options: { [key: string]: unknown }) {
		const tree = Parser.parseAll();

		if (options.optimize) {
			tree.optimize();
		}

		tree.iterate(tree => {
			if (tree.name === null) return;
			const flags = [
				(tree.name.startsWith("/") ? "non-cascading" : "cascading") + " group",
				...tree.flags,
			];
			console.log(`${this.indent(tree.fullname.length - 1)}${(tree.name.substr(tree.isCascading ? 0 : 1) + ":").padEnd(13, " ")}${flags.join(", ")}`);
			tree.leaves.forEach(leaf => {
				console.log(`${this.indent(tree.fullname.length)}${leaf.toString()}`);
			});
		}, true);
	}

	private indent(count: number) {
		return "  ".repeat(count);
	}
}