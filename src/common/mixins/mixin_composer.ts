import {
    Callback, Class, InstantiableClass, MixIn, MixInCallSignature,
} from "@/common/types";
import { waitUntil } from "@/utilities/miscellaneous";

/**
 * The MixInComposer class allows applying mix-ins in a chain to a base
 *   [abstract] class while keeping type signatures in check.
 * @example
 *     class Class extends MixInComposer.mix(BaseClass).with(MixIn).compose() {}
 */
export class MixInComposer<ClassT extends InstantiableClass> {
    /**
     * Begin a mix-in composition chain on a base [abstract] class.
     * @param Base The base class to apply the mix-ins to
     */
    public static mix<ClassT extends Class>(Base: ClassT) {
        return MixInComposer._mix(Base);
    }

    /**
     * This helper method is used to hide away the count variable used to keep
     *   count of the number of mix-ins that will require initialization during
     *   the instantiation chain of the final, mixed-in class.
     * @param Base The base class to apply the mix-ins to
     * @param count The number of mix-ins that has currently been applied
     */
    private static _mix<ClassT extends Class>(Base: ClassT, count: number = 0) {
        return new this(Base as ClassT & InstantiableClass, count);
    }

    private constructor(private _Base: ClassT, private _count: number) { }

    /**
     * Mix a mix-in into the base class.
     * @param _MixIn A mix-in function
     * @param args Arguments to call the mix-in function with
     */
    public with<MixInT extends MixIn<MixInT>>(
        _MixIn: MixInT,
        ...args: MixInCallSignature<MixInT>
    ) {
        return MixInComposer._mix(_MixIn(this._Base, ...args), this._count + 1);
    }

    /**
     * Return the mixed-in class.
     */
    public compose() {
        // Keep a count of mix-ins waiting for initialization.
        const mixinsRemaining: number = this._count;

        // tslint:disable-next-line: max-classes-per-file
        return class extends this._Base {
            private _mixinsRemaining: number = mixinsRemaining;

            constructor(...args: any[]) {
                super(...args);

                // Decrement the number of mix-inxs that are waiting on
                //   initialization.
                --this._mixinsRemaining;
            }

            /**
             * Call a callback after all the mix-ins have been applied.
             * @param callback The callback to call after all mix-ins have been
             *   initialized
             */
            public onMixInComplete(callback: Callback) {
                waitUntil(
                    () => this._mixinsRemaining === 0,
                    callback,
                );
                /*if (this._mixinsRemaining === 0) {
                    return callback();
                }

                const checker = setInterval(() => {
                    if (this._mixinsRemaining === 0) {
                        clearInterval(checker);
                        return callback();
                    }
                }, 0);*/
            }
        };
    }
}
