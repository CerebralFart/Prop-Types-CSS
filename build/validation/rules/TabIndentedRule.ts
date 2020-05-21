import Error from '../Error'
import Rule from "./Rule";

class TabIndentedRule implements Rule {
	validate(grammar: string): Error[] | null {
		const lines = grammar.split("\n");
		let errors = [];

		for (let idx in lines) {
			let line = lines[idx];
			let wspMatch = line.match(/^\s*/);
			let tabMatch = line.match(/^\t*/);
			if (wspMatch[0].length !== tabMatch[0].length) {
				errors.push(new Error(
					parseInt(idx) + 1,
					'Line is indented by whitespace characters other than [tab]'
				));
			}
		}

		return errors;
	}
}

export default TabIndentedRule;