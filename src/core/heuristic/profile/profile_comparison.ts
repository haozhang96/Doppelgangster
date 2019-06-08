// Import internal components.
import { UniquePair } from "@/common/classes/pair";
import { IExemplifiable, IScorable } from "@/common/interfaces/traits";
import { Expirable, Mix } from "@/common/mixins";
import { Optional } from "@/common/types";
import { Component } from "@/core/base/components";
import {
    CharacteristicComparison, ComparableCharacteristic,
} from "@/core/heuristic/characteristic";
import { Profile } from "@/core/heuristic/profile/profile";
import { StringUtils } from "@/utilities";

// Import configurations.
import * as Configs from "?/heuristic/profile/comparison";

/**
 * TODO
 */
export class ProfileComparison extends Mix(Component)
    .with(Expirable)
.compose() implements IExemplifiable<CharacteristicComparison<any>>, IScorable {
    // Public properties
    public readonly profiles: UniquePair<Profile>;
    public readonly score: number;
    public readonly similar: boolean;
    public readonly examples: ReadonlyArray<CharacteristicComparison<any>>;

    // Private properties
    private readonly _stringified: string;
    private readonly _stringifiedSimilarOnly: string;

    /**
     * Construct a ProfileAnalysis instance.
     * @param profile 
     */
    constructor(profileOne: Profile, profileTwo: Profile) {
        super(profileOne.doppelgangster);

        // TODO
        this.profiles = new UniquePair(profileOne, profileTwo);

        // TODO: Score threshold configs
        let score: number = 0;
        let threshold: number = 0;
        const examples: Array<CharacteristicComparison<any>> = [];

        for (const characteristic of profileOne.characteristics) {
            if (
                characteristic instanceof ComparableCharacteristic
                && characteristic.hasData
            ) {
                const comparison: Optional<CharacteristicComparison<any>> =
                    characteristic.compareToSelfInProfile(profileTwo);

                if (comparison && comparison.characteristics.two.hasData) {
                    score += comparison.score * comparison.weight;
                    threshold += comparison.weight;
                    /*this.doppelgangster.logger.debug(
                        `Adding ${characteristic.name}: score: ${analysis.score}, weight: ${analysis.weight}`
                    );*/
                    examples.push(comparison);
                }
            }
        }
        this.examples = examples;
        this.score = threshold === 0 ? 0 : score / threshold;
        this.similar = this.score >= Configs.scoreThreshold;

        // Stringify analyses.
        this._stringified = this.stringify(examples);
        this._stringifiedSimilarOnly =
            this.stringify(examples.filter((comparison) =>
                comparison.similar,
            ));
    }

    /**
     * Destroy the CharacteristicAnalysis instance.
     */
    public destroy(): void {
        return;
    }

    public toString(similarOnly?: boolean): string {
        return (
            similarOnly ?
                this._stringifiedSimilarOnly
            :
                this._stringified
        );
    }

    private stringify(examples: Array<CharacteristicComparison<any>>): string {
        return StringUtils.format(
            "[ProfileComparison#%s] %s and %s are %s%s",
            this.score.toFixed(2),
            (
                this.profiles.one.user ?
                    this.profiles.one.user.username
                :
                    this.profiles.one.userID
            ),
            (
                this.profiles.two.user ?
                    this.profiles.two.user.username
                :
                    this.profiles.two.userID
            ),
            this.similar ? "similar" : "not similar",
            (
                examples.length ?
                    ` {\n${
                        examples.map((comparison) =>
                            StringUtils.tabulate(comparison.toString()),
                        ).join("\n\n")
                    }\n}`
                :
                    "."
            ),
        );
    }
}
