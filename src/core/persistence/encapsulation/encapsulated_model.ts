import { Model } from "../model";

export abstract class EncapsulatedModel {
    constructor(private model: Model) { }
}
