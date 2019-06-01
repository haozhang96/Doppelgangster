export type ReturnInstead<T, U> =
    T extends (...args: any[]) => infer _R ? (...args: any[]) => U : T;
