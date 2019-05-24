import { IRefreshCallbackDescriptor } from "./refresh_callback";
import { RefreshableExpirable } from "./refreshable_expirable";

export abstract class TimeExpirable extends RefreshableExpirable {
    // Private properties
    private _time: Date | undefined;
    private _expires: Date | undefined;
    private readonly timeout: number;

    constructor(timeout: number, refreshCallback?: IRefreshCallbackDescriptor) {
        super(refreshCallback);
        this.timeout = timeout;
        this.refreshExpiration();
    }

    // Public methods
    public get time(): Date | undefined { return this._time; }
    public get expires(): Date | undefined { return this._expires; }
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
}
