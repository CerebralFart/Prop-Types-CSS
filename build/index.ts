import yargs from "yargs";
import Command from "./commands/command";
import CompileCommand from "./commands/compileCommand";
import ExplainCommand from "./commands/explainCommand";
import ValidateCommand from "./commands/validateCommand";

const commands: Command[] = [
	new CompileCommand(),
	new ExplainCommand(),
	new ValidateCommand(),
];

for (let command of commands) {
	yargs.command(command.name, command.description, (args: yargs.Argv) => command.configure(args));
}

const args = yargs.argv;
let command = commands.filter(command => command.name.startsWith(args._[0] + " ") || command.name === args._[0])[0];
command.execute(args);