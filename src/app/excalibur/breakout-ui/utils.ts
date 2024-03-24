type JSONValue =
	| string
	| number
	| boolean
	| JSONValue[]
	| {
			[key: string]: JSONValue;
	  }
	| null;

export type Accessor<T> = () => T;

export type SetterParams<T> = T | ((prev: T) => T);

export type Setter<T> = (updater: SetterParams<T>) => void;

export type Signal<T> = [get: Accessor<T>, set: Setter<T>];

export const createSignal = <T extends JSONValue>(
	initialValue: T,
	sideEffects?: [(state: T, setState: Setter<T>) => void]
): Signal<T> => {
	let value = initialValue;

	const get = () => value;
	const set = (updater: SetterParams<T>) => {
		typeof updater === "function"
			? (value = updater(value))
			: (value = updater);
	};

	const setWithSideEffects = (updater: SetterParams<T>) => {
		set(updater);
		sideEffects?.forEach((sideEffect) =>
			sideEffect(get(), setWithSideEffects)
		);
	};

	return [get, setWithSideEffects];
};
