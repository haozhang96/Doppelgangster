export type RecursiveReadonly<T> = {
	readonly [key in keyof T]: RecursiveReadonly<T[key]>;
};

export type MappedObject<T = any> = {
	[key: string]: T;
}