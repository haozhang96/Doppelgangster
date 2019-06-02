import {
    RefreshableExpirable,
} from "@/common/mixins/expirable/refreshable_expirable";
import { Callback, InstantiableClass } from "@/common/types";

/**
 * TODO
 * @param Base The base class to mix into
 * @param timeout ?
 * @param refreshCallback The callback to call when refreshing
 */
export function TimeExpirable<ClassT extends InstantiableClass>(
    Base: ClassT,
    timeout: number,
    refreshCallback?: Callback,
) {
    return class extends RefreshableExpirable(Base, refreshCallback) {
        // Private properties
        private _expires: Date;
        private _refreshedAt: Date;

        constructor(...args: any[]) {
            super(...args);

            this._refreshedAt = new Date();
            this._expires = new Date(this._refreshedAt.valueOf() + timeout);
        }

        public get expired(): boolean {
            return new Date() >= this._expires;
        }

        public get expires(): Date {
            return this._expires;
        }

        public get refreshedAt(): Date {
            return this._refreshedAt;
        }

        public expire(): void {
            this._expires = this._refreshedAt;
        }

        public async refresh(force: boolean = false): Promise<void> {
            if (!this._refreshing && (this._expired || force)) {
                await super.refresh();
                this._refreshedAt = new Date();
                this._expires = new Date(this._refreshedAt.valueOf() + timeout);
            }
        }
    };
}
