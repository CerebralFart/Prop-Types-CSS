import Command from "./command";
import yargs from "yargs";

export default class ValidateCommand implements Command {
	readonly name = "validate [file]";
	readonly description = "";

	configure(args: yargs.Argv) {
		return args
			.positional("file", {
				type: "string",
				default: "css.grmr",
			});
	}

	execute(options: { [key: string]: unknown }) {
		console.log("VALIDATE");
		//TODO
	}
}