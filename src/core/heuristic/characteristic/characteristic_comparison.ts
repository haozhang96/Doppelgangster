// Import internal components.
import { Pair, UniquePair } from "@/common/classes/pair";
import {
    IExemplifiable, IScorable, IWeightable,
} from "@/common/interfaces/traits";
import { Expirable, Mix } from "@/common/mixins";
import { Component } from "@/core/base/components";
import {
    ComparableCharacteristic,
} from "@/core/heuristic/characteristic/comparable_characteristic";
import { $ } from "@/utilities";

// Import configurations.
import * as Configs from "?/heuristic/characteristic/comparison";

/**
 * TODO
 */
export class CharacteristicComparison<ExampleT> extends Mix(Component)
    .with(Expirable)
.compose() implements IExemplifiable<Pair<ExampleT>>, IScorable, IWeightable {
    // Public properties
    public readonly characteristics:
        UniquePair<ComparableCharacteristic<any, ExampleT>>;
    public readonly weight: number;
    public readonly similar: boolean;

    // Private properties
    private readonly _stringified: string;

    /**
     * Construct a CharacterAnalysis instance.
     * @param characteristicOne
     * @param characteristicTwo
     * @param score 
     * @param examples 
     * @param exampleStringifier 
     */
    constructor(
        characteristicOne: ComparableCharacteristic<any, ExampleT>,
        characteristicTwo: ComparableCharacteristic<any, ExampleT>,
        public readonly score: number = 0,
        public readonly examples: ReadonlyArray<Pair<ExampleT>> = [],
        exampleStringifier?: (example: ExampleT) => string,
    ) {
        super(characteristicOne.doppelgangster);

        // TODO
        this.characteristics =
            new UniquePair(characteristicOne, characteristicTwo);

        // TODO: Score threshold configs
        this.weight = characteristicOne.weight;
        this.similar = score >= Configs.scoreThreshold;

        // TODO: Write string formatter utilities for this.
        const userOneName: string = (
            characteristicOne.profile.user ?
                characteristicOne.profile.user.username
            :
                characteristicOne.profile.userID
        );
        const userTwoName: string = (
            characteristicTwo.profile.user ?
                characteristicTwo.profile.user.username
            :
                characteristicTwo.profile.userID
        );
        const maxUsernameLength: number =
            Math.max(userOneName.length, userTwoName.length);
        this._stringified = $(
            (
                "[CharacteristicComparison#%s] {"
                + "\n\tFor: %s"
                + "\n\tSimilar: %s"
                + "\n\tExamples: %s"
                + "\n}"
            ),
            this.score.toFixed(2),
            this.characteristics.one,
            this.similar ? "Yes" : "No",
            (
                this.examples.length > 0 ?
                    `[\n\t\t{\n\t\t\t${
                        this.examples.map((example) =>
                            `[${
                                userOneName.padEnd(maxUsernameLength)
                            }] ${
                                (
                                    exampleStringifier ?
                                        exampleStringifier(example.one)
                                    :
                                        (example.one as any).toString()
                                ).replace(/\n/g, "\n\t\t\t")
                            }\n\t\t\t[${
                                userTwoName.padEnd(maxUsernameLength)
                            }] ${
                                (
                                    exampleStringifier ?
                                        exampleStringifier(example.two)
                                    :
                                        (example.two as any).toString()
                                ).replace(/\n/g, "\n\t\t\t")
                            }`,
                        ).join("\n\t\t},\n\t\t{\n\t\t\t")
                    }\n\t\t}\n\t]`
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
