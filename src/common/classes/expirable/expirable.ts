import { IExpirable } from "@/common/interfaces/traits";

export abstract class Expirable implements IExpirable {
    // Private properties
    private _expired: boolean = false;

    public get expired(): boolean {
        return this._expired;
    }

    public expire(): this {
        this._expired = true;
        return this;
    }
}
