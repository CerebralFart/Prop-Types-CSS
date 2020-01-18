export const capitalize: StringMapper = (value: string): string => (
	value.charAt(0).toUpperCase() +
	value.substring(1)
);

export type StringMapper = (v: string) => string;