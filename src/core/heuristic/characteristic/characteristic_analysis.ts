// Import internal components.
import {
    IExemplifiable, IScorable, IWeightable,
} from "@/common/interfaces/traits";
import { Expirable, Mix } from "@/common/mixins";
import { Component } from "@/core/base/components";
import {
    IncomparableCharacteristic,
} from "@/core/heuristic/characteristic/incomparable_characteristic";
import { $ } from "@/utilities";

// Import configurations.
import * as Configs from "?/heuristic/characteristic/analysis";

/**
 * TODO
 */
export class CharacteristicAnalysis<ExampleT> extends Mix(Component)
    .with(Expirable)
.compose() implements IExemplifiable<ExampleT>, IScorable, IWeightable {
    // Public properties
    public readonly weight: number;
    public readonly suspicious: boolean;

    // Private properties
    private readonly _stringified: string;

    /**
     * Construct a CharacterAnalysis instance.
     * @param characteristic 
     * @param score 
     * @param examples 
     * @param exampleStringifier 
     */
    constructor(
        public readonly characteristic:
            IncomparableCharacteristic<any, ExampleT>,
        public readonly score: number = 0,
        public readonly examples: readonly ExampleT[] = [],
        exampleStringifier?: (example: ExampleT) => string,
    ) {
        super(characteristic.doppelgangster);

        // TODO: Score threshold configs
        this.weight = characteristic.weight;
        this.suspicious = score >= Configs.scoreThreshold;

        // TODO: Write string formatter utilities for this.
        this._stringified = $(
            (
                "[CharacteristicAnalysis#%s] {"
                + "\n\tFor: %s"
                + "\n\tSuspicious: %s"
                + "\n\tExamples: %s"
                + "\n}"
            ),
            this.score.toFixed(2),
            this.characteristic,
            this.suspicious ? "Yes" : "No",
            (
                this.examples.length > 0 ?
                    `[\n\t\t${
                        this.examples.map((example) =>
                            (
                                exampleStringifier ?
                                    exampleStringifier(example)
                                :
                                    (example as any).toString()
                            ).replace(/\n/g, "\n\t\t\t"),
                        ).join("\n\t\t")
                    }\n\t]`
                :
                    "None"
            ),
        );
    }

    /**
     * Destroy the CharacteristicAnalysis instance.
     */
    public destroy(): void {
        return;
    }

    public toString(): string {
        return this._stringified;
    }
}
