// Import internal components.
import { IExpirable } from "@/common/interfaces/traits";
import { InstantiableClass } from "@/common/types";

/**
 * The Expirable mix-in class allows flagging the instance as expired.
 * @param Base The base class to mix into
 */
export function Expirable<ClassT extends InstantiableClass>(Base: ClassT) {
    return class extends Base implements IExpirable {
        protected _expired: boolean = false;

        public get expired(): boolean {
            return this._expired;
        }

        public expire(): void {
            this._expired = true;
        }
    };
}
