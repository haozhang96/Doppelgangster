// Import internal components.
import { Expirable, Mix } from "@/common/mixins";
import { Component } from "@/core/base/components";
import { CharacteristicAnalysis } from "@/core/heuristic/characteristic";
import { Profile } from "@/core/heuristic/profile/profile";
import { ProfileAnalysis } from "@/core/heuristic/profile/profile_analysis";
import { ProfileComparison } from "@/core/heuristic/profile/profile_comparison";
import { StringUtils } from "@/utilities";

/**
 * TODO
 */
export class ProfileReport extends Mix(Component).with(Expirable).compose() {
    // Public properties
    public readonly profileAnalysis: ProfileAnalysis;
    public readonly similarProfiles: ReadonlyArray<ProfileComparison> = [];
    public readonly suspiciousCharacteristics:
        ReadonlyArray<CharacteristicAnalysis<any>>;

    // Private properties
    private readonly _stringified: string;
    private readonly _stringifiedSimilarOnly: string;
    private readonly _stringifiedSuspiciousOnly: string;
    private readonly _stringifiedSuspiciousAndSimilarOnly: string;

    /**
     * Construct a ProfileReport instance.
     * @param profile 
     * @param against 
     */
    constructor(public readonly profile: Profile, against?: Profile[]) {
        super(profile.doppelgangster);

        // Set the profile analysis that was used to create this report.
        this.profileAnalysis = profile.analysis;

        // Find all suspicious incomparable characteristics.
        this.suspiciousCharacteristics =
            profile.analysis.examples.filter((analysis) => analysis.suspicious);

        // Compare all comparable characteristics against themselves in the
        //   other profiles.
        if (against) {
            this.similarProfiles =
                against.filter((_profile) =>
                    _profile !== profile,
                ).map((_profile) =>
                    profile.compareTo(_profile),
                ).filter((comparison) =>
                    comparison !== undefined,
                ).filter((comparison) =>
                    comparison && comparison.similar,
                );
        }

        // Stringify analyses.
        this._stringified = this.stringify(false, false);
        this._stringifiedSimilarOnly = this.stringify(false, true);
        this._stringifiedSuspiciousOnly = this.stringify(true, false);
        this._stringifiedSuspiciousAndSimilarOnly = this.stringify(true, true);
    }

    public get expired(): boolean { // TODO: Is this good?
        return (
            this.profileAnalysis.expired
            || this.suspiciousCharacteristics.some((analysis) =>
                analysis.expired,
            ) || this.similarProfiles.some((comparison) => comparison.expired)
        );
    }

    /**
     * Destroy the CharacteristicAnalysis instance.
     */
    public destroy(): void {
        return;
    }

    public toString(
        suspiciousIncomparableCharacteristicsOnly?: boolean, similarComparableCharacteristicsOnly?: boolean,
    ): string {
        return (
            (
                suspiciousIncomparableCharacteristicsOnly
                && similarComparableCharacteristicsOnly
            ) ?
                this._stringifiedSuspiciousAndSimilarOnly
            : suspiciousIncomparableCharacteristicsOnly ?
                this._stringifiedSuspiciousOnly
            : similarComparableCharacteristicsOnly ?
                this._stringifiedSimilarOnly
            :
                this._stringified
        );
    }

    private stringify(
        suspiciousIncomparableCharacteristicsOnly: boolean,
        similarComparableCharacteristicsOnly: boolean,
    ): string {
        const profileAnalysisString: string =
            this.profileAnalysis.toString(
                suspiciousIncomparableCharacteristicsOnly,
            );
        const similarProfilesString: string = (
            this.similarProfiles.length > 0 ?
                this.similarProfiles.map((comparison) =>
                    StringUtils.tabulate(comparison.toString(
                        similarComparableCharacteristicsOnly,
                    )),
                ).join("\n\n")
            :
                ""
        );

        return StringUtils.format(
            "[ProfileReport] %s %s",
            (
                this.profile.user ?
                    this.profile.user.username
                :
                    this.profile.userID
            ),
            (
                profileAnalysisString.includes("\n") || similarProfilesString ?
                    StringUtils.tabulate(
                        `{\n${
                            profileAnalysisString
                        }\n\n\t[SimilarProfiles] ${
                            similarProfilesString ?
                                `{\n${
                                    similarProfilesString
                                }\n\t}`
                            :
                                "There are no profiles similar to this one."
                        }\n}`,
                    )
                :
                    "appears to be clean without suspicious characteristics or "
                    + "similar profiles."
            ),
        );
    }
}
