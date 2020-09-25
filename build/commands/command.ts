import {Argv} from "yargs";

export default interface Command {
	readonly name: string;
	readonly description: string;

	configure(args: Argv): Argv;

	execute(options: {[key:string]:unknown}): void;
}