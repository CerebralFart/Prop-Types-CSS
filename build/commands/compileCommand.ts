import Command from "./command";
import yargs from "yargs";
import Parser from "../ast/parser";
import StringBuffer from "../emitters/stringBuffer";
import IsFnEmitter from "../emitters/isFnEmitter";
import CheckBuilderEmitter from "../emitters/checkBuilderEmitter";
import ExportEmitter from "../emitters/exportEmitter";
import fs from "fs";

export default class CompileCommand implements Command {
	static emitters = [
		new IsFnEmitter(),
		new CheckBuilderEmitter(),
		new ExportEmitter(),
	];

	readonly name = "compile";
	readonly description = "Compile definitions to prop-type checkers";

	configure(args: yargs.Argv) {
		return args
			.option("optimize", {
				alias: "o",
			})
			.option("output", {
				default: `${__dirname}/../../dist/index.js`,
			})
			.option("stdOut", {});
		//TODO what arguments does this have? Debug flags?
	}

	execute(options: { [key: string]: unknown }) {
		const tree = Parser.parseAll();

		if (options.optimize) {
			tree.optimize();
		}

		const buffer = new StringBuffer();
		for (let emitter of CompileCommand.emitters) {
			emitter.emit(tree, buffer);
		}

		if (options.stdOut) {
			console.log(buffer.toString());
		} else {
			if (!fs.existsSync("./dist/")) {
				fs.mkdirSync("./dist");
			}

			if (fs.existsSync("./dist/index.js")) {
				fs.unlinkSync("./dist/index.js");
			}

			fs.writeFileSync("./dist/index.js", buffer.toString());
		}
	}
}