class Error {
	readonly line: number;
	readonly message: string;

	constructor(line: number, message: string) {
		this.line = line;
		this.message = message;
	}
}

export default Error;