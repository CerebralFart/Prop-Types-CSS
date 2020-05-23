import Definition from "./Definition";
import Tree from "../Tree";

class RegexDefinition extends Definition {
	readonly references: string[][] = [];
	readonly regexp: string;

	constructor(value: string) {
		super();
		if (!value.startsWith('/') || !value.endsWith('/')) {
			throw new Error(`Regex definitions should start and end with a slash (/)`)
		}
		value = value.substring(1, value.length - 1);

		let referenceMatch = value.match(/<[a-z\.]+>(\|<[a-z\.]+>)*/g);
		if (referenceMatch !== null) {
			for (let reference of referenceMatch) {
				let matches = reference.split('|');
				this.references.push(matches.map(v => v.substring(1, v.length - 1)));

				value = value.replace(reference, '(.*)');
			}
		}

		this.regexp = value;
	}

	compile(varName: string, root: Tree, counter: number): string {
		//TODO optimize regex matching by pulling in regex definitions
		let out = '';
		let label = 'lbl_' + counter;

		out += `\t${label}:{\n`;
		out += `\t\tlet match = ${varName}.match(/^${this.regexp}\$/);\n`;
		out += `\t\tif (match === null) break ${label};\n`;
		for (let i = 0; i < this.references.length; i++) {
			let check = this.references[i]
				.map(v => `!is${root.resolve(v).getName()}(match[${i + 1}])`)
				.join(' && ');
			out += `\t\tif (${check}) break ${label};\n`;
		}
		out += `\t\treturn true;\n`;
		out += `\t}\n`;

		return out;
	}
}

export default RegexDefinition;