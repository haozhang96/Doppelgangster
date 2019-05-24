import {
    IRefreshCallbackDescriptor, RefreshCallback,
} from "./refresh_callback";

import { IExpirable } from "@/common/interfaces/traits";

export abstract class RefreshableExpirable implements IExpirable {
    // Protected properties
    protected readonly refreshCallback: RefreshCallback | undefined;

    // Private properties
    private _expired: boolean = false;

    constructor(refreshCallback?: IRefreshCallbackDescriptor) {
        if (refreshCallback) {
            this.refreshCallback = refreshCallback.callback;
            if (refreshCallback.interval) {
                setInterval(this.refresh, refreshCallback.interval, true);
            }
        }
    }


    // Public methods
    public get expired(): boolean { return this._expired; }

    public refresh(force: boolean = false): this {
        if (force || this._expired) {
            if (this.refreshCallback) {
                this.refreshCallback();
            }
            this._expired = false;
        }
        return this;
    }
}
