export type Callback<ArgumentsT = any, ReturnT = void> =
    (...args: ArgumentsT[]) => ReturnT;
