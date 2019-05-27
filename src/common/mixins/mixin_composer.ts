import {
    Class, InstantiableClass, MixIn, MixInCallSignature,
} from "@/common/types";

/**
 * STUB
 */
export class MixInComposer<ClassT extends InstantiableClass> {
    public static mix<ClassT extends (Class | InstantiableClass)>(
        Base: ClassT,
    ) {
        return new this(Base as ClassT & InstantiableClass);
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
    public done() {
        return this._Base;
    }
}
