export const capitalize: StringMapper = (value: string): string => {
	return (
		value.charAt(0).toUpperCase() +
		value.substring(1)
	)
};

export type StringMapper = (v: string) => string;