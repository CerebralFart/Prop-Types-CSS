const ptcBuilder = `
const buildPropTypeCheck = func => {
	let wrapped = (props, propName, componentName) => {
		if (props[propName]) {
			let response = func(props[propName], propName, componentName || 'ANONYMOUS');
			if (typeof response === 'string') return new Error(response);
			if (response === undefined) return null;
			return response;
		}
	};
	wrapped.isRequired = (props, propName, componentName) => {
		if (props[propName] == null) {
			return new Error(\`\${propName} in \${componentName || 'ANONYMOUS'} is required\`);
		}
		return wrapped(props, propName, componentName);
	};
	return wrapped;
};
`.trim();

export default ptcBuilder;