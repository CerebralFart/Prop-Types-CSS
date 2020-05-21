import Definition from "./Definition";

class LiteralDefinition extends Definition {
	private literal: string;

	constructor(value: string) {
		super();
		if (!/^[0-9a-zA-Z]/.test(value)) {
			throw new Error(`Literal definitions should start with a number or a letter`)
		}
		this.literal = value;
	}

	compile(varName: string): string {
		return `\tif (${varName} === '${this.literal}') return true;\n`;
	}
}

export default LiteralDefinition;