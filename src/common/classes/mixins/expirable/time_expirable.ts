import {
    IRefreshCallbackDescriptor, RefreshableExpirable, RefreshCallback,
} from "@/common/classes/mixins/expirable";
import { InstantiableClass, Optional } from "@/common/types";

export function TimeExpirable<ClassT extends InstantiableClass>(
    Base: ClassT,
    timeout: number,
    refreshCallback?: IRefreshCallbackDescriptor,
) {
    return class extends (
        RefreshableExpirable(Base, refreshCallback) as ClassT
    ) {
        // Protected properties
        protected readonly refreshCallback: Optional<RefreshCallback>;

        // Private properties
        private readonly timeout: number;
        private _time: Optional<Date>;
        private _expires: Optional<Date>;

        constructor(...args: any[]) {
            super(...args);
            this.timeout = timeout;
            this.refreshExpiration();
        }

        // Public methods
        public get time(): Optional<Date> { return this._time; }
        public get expires(): Optional<Date> { return this._expires; }
        public get expired(): boolean {
            return this._expires && new Date() >= this._expires || false;
        }

        public refresh(force: boolean = false): this {
            if (force || this.expired) {
                if (this.refreshCallback) {
                    this.refreshCallback();
                }
                this.refreshExpiration();
            }
            return this;
        }

        // Private methods
        private refreshExpiration(): this {
            this._time = new Date();
            this._expires = new Date(this._time);
            this._expires.setMilliseconds(
                this._expires.getMilliseconds() + this.timeout,
            );
            return this;
        }
    };
}
