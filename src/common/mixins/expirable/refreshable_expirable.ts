// Import internal components.
import { Expirable } from "@/common/mixins/expirable/expirable";
import { Callback, InstantiableClass } from "@/common/types";

/**
 * TODO
 * @param Base The base class to mix into
 * @param refreshCallback The callback to call when refreshing
 * @param refreshInterval The regular interval in milliseconds to refresh in
 */
export function RefreshableExpirable<ClassT extends InstantiableClass>(
    Base: ClassT,
    refreshCallback?: Callback,
    refreshInterval?: number,
) {
    return class extends Expirable(Base as InstantiableClass) {
        protected _refreshing: boolean = false;

        constructor(...args: any[]) {
            super(...args);

            if (refreshInterval) {
                setInterval(this.refresh, refreshInterval, true);
            }
        }

        public async refresh(force: boolean = false): Promise<void> {
            if (
                refreshCallback
                && !this._refreshing
                && (this._expired || force)
            ) {
                this._refreshing = true;
                await refreshCallback();
                this._refreshing = false;
            }
            this._expired = false;
        }
    };
}
