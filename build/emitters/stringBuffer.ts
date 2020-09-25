export default class StringBuffer {
	private buffer: string[] = [];

	public indent(count: number = 1) {
		return this.append("\t".repeat(count));
	}

	public append(data: string): this {
		this.buffer.push(data);
		return this;
	}

	public newline(): this {
		return this.append("\n");
	}

	public toString() {
		return this.buffer.join("");
	}
}