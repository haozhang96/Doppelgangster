import { Profile, ProfileAnalysis, ProfileComparison, CharacteristicAnalysis } from "@";
import { IExpirable } from "@/Interfaces";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";


export class ProfileReport implements IExpirable {
    // Public properties
    public readonly profile: Profile;
    public readonly profileAnalysis: ProfileAnalysis;
    public readonly suspiciousCharacteristics: ReadonlyArray<CharacteristicAnalysis<any>>;
    public readonly similarProfiles: ReadonlyArray<ProfileComparison>;

    // Private properties
    private readonly stringified: string;
    private readonly stringifiedSuspiciousIncomparableCharacteristicsOnly: string;
    private readonly stringifiedSimilarComparableCharacteristicsOnly: string;
    private readonly stringifiedSuspiciousIncomparableAndSimilarComparableCharacteristicsOnly: string;


	/**
	 * Constructor
	 * @param profileOne The first profile
	 * @param profileTwo The second profile
	 */
	constructor(profile: Profile, against?: Profile[]) {
        this.profileAnalysis = (this.profile = profile).analysis;

        // Find all suspicious incomparable characteristics
        this.suspiciousCharacteristics = profile.analysis.examples.filter(analysis => analysis.suspicious);
        
        // Compare all comparable characteristics against themselves in the other profiles
        this.similarProfiles = against ? (
            against.filter(_profile => _profile !== profile).map(_profile => profile.compareTo(_profile)).filter(comparison => comparison !== undefined) as ProfileComparison[]
        ).filter(comparison => comparison && comparison.similar) : [];

        // Stringify report
        const   profileAnalysisString: string = Utilities.String.tabulate(this.profileAnalysis.toString()),
                profileAnalysisSuspiciousCharacteristicsOnlyString: string = Utilities.String.tabulate(this.profileAnalysis.toString(true)),
                similarProfilesString: string = this.similarProfiles.length ? this.similarProfiles.map(comparison => Utilities.String.tabulate(comparison.toString(), 2)).join("\n\n") : "",
                similarProfilesSimilarCharacteristicsOnlyString: string = this.similarProfiles.length ? this.similarProfiles.map(comparison => Utilities.String.tabulate(comparison.toString(true), 2)).join("\n\n") : "";
        this.stringified = this.stringify(profileAnalysisString, similarProfilesString);
        this.stringifiedSuspiciousIncomparableCharacteristicsOnly = this.stringify(profileAnalysisSuspiciousCharacteristicsOnlyString, similarProfilesString);
        this.stringifiedSimilarComparableCharacteristicsOnly = this.stringify(profileAnalysisString, similarProfilesSimilarCharacteristicsOnlyString);
        this.stringifiedSuspiciousIncomparableAndSimilarComparableCharacteristicsOnly = this.stringify(profileAnalysisSuspiciousCharacteristicsOnlyString, similarProfilesSimilarCharacteristicsOnlyString);
    }
    

    // Public methods
    public get expired(): boolean { // TODO: Is this good?
        return this.profileAnalysis.expired || this.suspiciousCharacteristics.some(analysis => analysis.expired) || this.similarProfiles.some(comparison => comparison.expired);
    }

    public toString(suspiciousIncomparableCharacteristicsOnly?: boolean, similarComparableCharacteristicsOnly?: boolean): string {
        return  suspiciousIncomparableCharacteristicsOnly && similarComparableCharacteristicsOnly ? this.stringifiedSuspiciousIncomparableAndSimilarComparableCharacteristicsOnly :
                suspiciousIncomparableCharacteristicsOnly ? this.stringifiedSuspiciousIncomparableCharacteristicsOnly :
                similarComparableCharacteristicsOnly ? this.stringifiedSimilarComparableCharacteristicsOnly :
                this.stringified;
    }


    // Private methods
    private stringify(profileAnalysisString: string, similarProfilesString: string): string {
        return `[ProfileReport] ${this.profile.user.username} ${profileAnalysisString.includes("\n") || similarProfilesString ? (
            `{\n${profileAnalysisString}\n\n\t[SimilarProfiles] ${similarProfilesString ? `{\n${similarProfilesString}\n\t}` : "There are no profiles similar to this one."}\n}`
        ) : "appears to be clean without suspicious characteristics or similar profiles."}`;
    }
}