import { IExpirable } from "@/common/interfaces/traits";
import { InstantiableClass } from "@/common/types";

export function Expirable<ClassT extends InstantiableClass>(Base: ClassT) {
    return class extends Base implements IExpirable {
        // Private properties
        private _expired: boolean = false;

        public get expired(): boolean {
            return this._expired;
        }

        public expire(): this {
            this._expired = true;
            return this;
        }
    };
}
