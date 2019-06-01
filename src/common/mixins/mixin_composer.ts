import {
    Class, InstantiableClass, MixIn, MixInCallSignature,
} from "@/common/types";

/**
 * The MixInComposer class allows applying mix-ins in a chain to a base
 *   [abstract] class while keeping type signatures in check.
 * @example
 *     class Class extends MixInComposer(BaseClass).with(MixIn).compose() { }
 */
export class MixInComposer<ClassT extends InstantiableClass> {
    /**
     * Begin a mix-in composition chain on a base [abstract] class.
     * @param Base The base class to apply the mix-ins to
     */
    public static mix<ClassT extends Class | InstantiableClass>(Base: ClassT) {
        return new MixInComposer(Base as ClassT & InstantiableClass);
    }

    private constructor(private _Base: ClassT) { }

    /**
     * Mix a mix-in into the base class.
     * @param _MixIn A mix-in function
     * @param args Arguments to call the mix-in function with
     */
    public with<MixInT extends MixIn<MixInT>>(
        _MixIn: MixInT,
        ...args: MixInCallSignature<MixInT>
    ) {
        return MixInComposer.mix(_MixIn(this._Base, ...args));
    }

    /**
     * Return the mixed-in class.
     */
    public compose() {
        return this._Base;
    }
}
