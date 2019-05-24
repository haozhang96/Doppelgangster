import { EncapsulatedModel } from "./encapsulation/encapsulated_model";

export abstract class Model {
    protected static readonly _modelSet: string;

    public encapsulate(Type: typeof EncapsulatedModel): EncapsulatedModel {
        return new Type(this);
    }
}
