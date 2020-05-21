import Error from '../Error';

interface Rule {
	validate(grammar: string): Error[] | null;
}

export default Rule;