import { IExpirable } from "@/common/interfaces/traits";
import { InstantiableClass, Optional } from "@/common/types";
import {
    IRefreshCallbackDescriptor, RefreshCallback,
} from "./refresh_callback";

export function RefreshableExpirable<ClassT extends InstantiableClass>(
    Base: ClassT,
    refreshCallback?: IRefreshCallbackDescriptor,
) {
    return class extends Base implements IExpirable {
        // Protected properties
        protected readonly refreshCallback: Optional<RefreshCallback>;

        // Private properties
        private _expired: boolean = false;

        public get expired(): boolean {
            return this._expired;
        }

        constructor(...args: any[]) {
            super(...args);
            if (refreshCallback) {
                this.refreshCallback = refreshCallback.callback;
                if (refreshCallback.interval) {
                    setInterval(this.refresh, refreshCallback.interval, true);
                }
            }
        }

        public refresh(force: boolean = false): this {
            if (force || this._expired) {
                if (this.refreshCallback) {
                    this.refreshCallback();
                }
                this._expired = false;
            }
            return this;
        }
    };
}
