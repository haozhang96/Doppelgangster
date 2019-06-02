// Import internal components.
import { IExemplifiable, IScorable } from "@/common/interfaces/traits";
import { Expirable, Mix } from "@/common/mixins";
import { Optional } from "@/common/types";
import { Component } from "@/core/base/components";
import {
    CharacteristicAnalysis, IncomparableCharacteristic,
} from "@/core/heuristic/characteristic";
import { Profile } from "@/core/heuristic/profile/profile";
import { StringUtils } from "@/utilities";

// Import configurations.
import * as Configs from "?/heuristic/profile/analysis";

/**
 * TODO
 */
export class ProfileAnalysis extends Mix(Component)
    .with(Expirable)
.compose() implements IExemplifiable<CharacteristicAnalysis<any>>, IScorable {
    // Public properties
    public readonly score: number;
    public readonly suspicious: boolean;
    public readonly examples: ReadonlyArray<CharacteristicAnalysis<any>>;

    // Private properties
    private readonly _stringified: string;
    private readonly _stringifiedSuspiciousOnly: string;

    /**
     * Construct a ProfileAnalysis instance.
     * @param profile 
     */
    constructor(public readonly profile: Profile) {
        super(profile.doppelgangster);

        // TODO: Score threshold configs
        let score: number = 0;
        let threshold: number = 0;
        const examples: Array<CharacteristicAnalysis<any>> = [];

        for (const characteristic of profile.characteristics) {
            if (
                characteristic instanceof IncomparableCharacteristic
                && characteristic.hasData
            ) {
                const analysis: Optional<CharacteristicAnalysis<any>> =
                    characteristic.analysis;

                if (analysis) {
                    score += analysis.score * analysis.weight;
                    threshold += analysis.weight;
                    /*this.doppelgangster.logger.debug(
                        `Adding ${characteristic.name}: score: ${analysis.score}, weight: ${analysis.weight}`
                    );*/
                    examples.push(analysis);
                }
            }
        }
        this.examples = examples;
        this.score = threshold === 0 ? 0 : score / threshold;
        this.suspicious = this.score >= Configs.scoreThreshold;

        // Stringify analyses.
        this._stringified = this.stringify(examples);
        this._stringifiedSuspiciousOnly =
            this.stringify(examples.filter((analysis) => analysis.suspicious));
    }

    /**
     * Destroy the CharacteristicAnalysis instance.
     */
    public destroy(): void {
        return;
    }

    public toString(suspiciousOnly?: boolean): string {
        return (
            suspiciousOnly ?
                this._stringifiedSuspiciousOnly
            :
                this._stringified
        );
    }

    private stringify(examples: Array<CharacteristicAnalysis<any>>): string {
        return StringUtils.format(
            "[ProfileAnalysis#%s] %s is %s%s",
            this.score.toFixed(2),
            (
                this.profile.user ?
                    this.profile.user.username
                :
                    this.profile.userID
            ),
            this.suspicious ? "suspicious" : "not suspicious",
            (
                examples.length ?
                    ` {\n${
                        examples.map((analysis) =>
                            StringUtils.tabulate(analysis.toString()),
                        ).join("\n\n")
                    }\n}`
                :
                    "."
            ),
        );
    }
}
