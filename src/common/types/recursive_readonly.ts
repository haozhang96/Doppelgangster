export type RecursiveReadonly<T = object> = {
    readonly [key in keyof T]: RecursiveReadonly<T[key]>;
};
