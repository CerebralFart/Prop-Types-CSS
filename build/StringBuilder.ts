class StringBuilder {
	private buffer: string = '';

	public append(data: string | StringBuilder): this {
		if (typeof data === 'string') {
			this.buffer += data;
		} else {
			this.buffer += data.toString();
		}
		return this;
	}

	public indent(amount: number = 1): this {
		this.buffer += '\t'.repeat(amount);
		return this;
	}

	public newLine(): this {
		this.buffer += '\n';
		return this;
	}

	public toString(): string {
		return this.buffer;
	}
}

export default StringBuilder;