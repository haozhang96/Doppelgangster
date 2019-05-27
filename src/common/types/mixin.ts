import { Callback } from "./callback";
import { InstantiableClass } from "./class";

export type MixIn<MixInT extends Callback> =
    <ClassT extends InstantiableClass>(Base: ClassT, ...args: any[]) =>
        ClassT & ReturnType<MixInT>;

export type MixInCallSignature<MixInT extends Callback> =
    MixInT extends <ClassT extends InstantiableClass>(
        Base: ClassT,
        ...args: infer R
    ) => any ? R : never;
