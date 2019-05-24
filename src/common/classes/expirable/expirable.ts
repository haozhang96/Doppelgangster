import { IExpirable } from "@/common/interfaces/traits";


export abstract class Expirable implements IExpirable {
    // Private properties
    private _expired: boolean = false;

    // Public methods
    public get expired(): boolean { return this._expired; }
    public expire(): this { return (this._expired = true) && this; }
}
