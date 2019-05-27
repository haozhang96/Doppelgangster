export type ReturnInstead<T, U> =
    T extends (...args: any[]) => infer R ? (...args: any[]) => U : T;
