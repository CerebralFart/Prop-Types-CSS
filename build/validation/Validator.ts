import Error from "./Error";
import Rule from "./rules/Rule";
import TabIndentedRule from "./rules/TabIndentedRule";
import RegexPrefixRule from "./rules/RegexPrefixRule";
import RegexSuffixRule from "./rules/RegexSuffixRule";

class Validator {
	static validate(grammar: string): boolean {
		let validator = new Validator();
		return validator.validate(grammar);
	}

	static rules: Rule[] = [
		new RegexPrefixRule(),
		new RegexSuffixRule(),
		new TabIndentedRule()
	];

	public validate(grammar: string): boolean {
		let errors = Validator.rules
			.map(rule => rule.validate(grammar))
			.reduce((acc, cur) => [...acc, ...cur], []);
		if (errors.length === 0) return true;
		this.printErrors(grammar, errors);
		return false;
	}

	private printErrors(grammar: string, errors: Error[]) {
		console.log('Some errors were encountered when compiling the grammar file:');
		let lines = grammar.split("\n");
		let logLineCount = Math.ceil(Math.log10(lines.length));
		for (let i in lines) {
			let idx = parseInt(i);
			let lineErrors = errors.filter(error => error.line == idx + 1);
			if (lineErrors.length > 0) {
				console.log(`${(idx + 1).toFixed(0).padStart(logLineCount, '0')}: "${lines[i]}"\n${lineErrors.map(error => `  - ${error.message}`)}`)
			}
		}
	}
}

export default Validator;