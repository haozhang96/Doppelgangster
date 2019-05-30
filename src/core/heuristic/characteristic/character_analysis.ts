// Import internal components.
import {
    IExemplifiable, IScorable, IWeightable,
} from "@/common/interfaces/traits";
import { Expirable, Mix } from "@/common/mixins";
import { Component } from "@/core/base/components";
import { IncomparableCharacteristic } from "./incomparable_characteristic";

/**
 * STUB
 */
export class CharacteristicAnalysis<ExampleT> extends Mix(Component)
    .with(Expirable)
.compose() implements IExemplifiable<ExampleT>, IScorable, IWeightable {
    // Public properties
    public readonly weight: number;
    public readonly suspicious: boolean;

    // Private properties
    private readonly _stringified: string;

    constructor(
        public readonly characteristic:
            IncomparableCharacteristic<any, ExampleT>,
        public readonly score: number,
        public readonly examples: ExampleT[] = [],
        exampleStringifier?: (example: ExampleT) => string,
    ) {
        super(characteristic.doppelgangster);

        this.weight = characteristic.weight;
        this.suspicious = score >= ;

        // TODO: Write string formatter utilities for this.
        this._stringified = ;
    }

    /**
     * Destroy the CharacteristicAnalysis instance.
     */
    public destroy(): void {
        this.examples.splice(0);
    }

    public toString(): string {
        return this._stringified;
    }
}