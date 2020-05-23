import Rule from "./Rule";
import Error from "../Error";

class RegexPrefixRule implements Rule {
	validate(grammar: string): Error[] | null {
		const lines = grammar.split("\n");
		let errors = [];

		for (let idx in lines) {
			let line = lines[idx];
			if (/\/\^/.test(line)) {
				errors.push(new Error(
					parseInt(idx) + 1,
					"Regex definitions should not include start markers (^). Definitions always match the entire value.",
				));
			}
		}

		return errors;
	}
}

export default RegexPrefixRule;