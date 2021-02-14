export interface Flag {
	transform?: (varName: string) => string;
}

export const flags: { [key: string]: Flag } = {
	caseInsensitive: {
		transform: varName => `${varName} = ${varName}.toLowerCase();`,
	},
};