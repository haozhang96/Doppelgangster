import { IExpirable } from "@/Interfaces";


interface IRefreshCallback {
    callback: Function;
    interval?: number;
}


export abstract class Expirable implements IExpirable {
    // Private properties
    private _expired: boolean = false;

    // Public methods
    public get expired(): boolean { return this._expired; }
    public expire(): this { return (this._expired = true) && this; }
}


export abstract class RefreshableExpirable implements IExpirable {
    // Protected properties
    protected readonly refreshCallback: Function | undefined;

    // Private properties
    private _expired: boolean = false;

    
    constructor(refreshCallback?: IRefreshCallback) {
        if (refreshCallback) {
            this.refreshCallback = refreshCallback.callback;
            if (refreshCallback.interval) setInterval(this.refresh, refreshCallback.interval, true);
        }
    }


    // Public methods
    public get expired(): boolean { return this._expired; }

    public refresh(force: boolean = false): this {
        if (force || this._expired) {
            if (this.refreshCallback) this.refreshCallback();
            this._expired = false;
        }
        return this;
    }
}


export abstract class TimeExpirable extends RefreshableExpirable {
    // Private properties
    private _time: Date | undefined;
    private _expires: Date | undefined;
    private readonly timeout: number;


    constructor(timeout: number, refreshCallback?: IRefreshCallback) {
        super(refreshCallback);
        this.timeout = timeout;
        this.refreshExpiration();
    }


    // Public methods
    public get time(): Date | undefined { return this._time; }
    public get expires(): Date | undefined { return this._expires; }
    public get expired(): boolean { return this._expires && new Date() >= this._expires || false; }

    public refresh(force: boolean = false): this {
        if (force || this.expired) {
            if (this.refreshCallback) this.refreshCallback();
            this.refreshExpiration();
        }
        return this;
    }


    // Private methods
    private refreshExpiration(): this {
        this._expires = new Date(this._time = new Date()); this._expires.setMilliseconds(this._expires.getMilliseconds() + this.timeout);
        return this;
    }
}