export type Callback<ArgumentsT = any, ReturnT = void> =
    (...args: ArgumentsT[]) => ReturnT;

export type CallbackCallSignature<CallbackT extends Callback> =
    CallbackT extends (...args: infer R) => any ? R : never;
