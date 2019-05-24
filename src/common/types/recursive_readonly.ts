export type RecursiveReadonly<T> = {
    readonly [key in keyof T]: RecursiveReadonly<T[key]>;
};
