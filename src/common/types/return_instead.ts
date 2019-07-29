export type ReturnInstead<T, U> =
    T extends (...args: infer R) => any ? (...args: R) => U : T;
