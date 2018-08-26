import { Profile, ComparableCharacteristic, CharacteristicComparison } from "@";
import { Expirable } from "@/Classes/Expirable";
import { UniquePair } from "@/Classes/Pair";
import { IScored, IExemplifiable } from "@/Interfaces";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";
import Configurations from "Configurations";


export class ProfileComparison extends Expirable implements IScored, IExemplifiable<CharacteristicComparison<any>> {
	// Public properties
	public readonly profiles: UniquePair<Profile>;
	public readonly score: number;
	public readonly similar: boolean;
	public readonly examples: ReadonlyArray<CharacteristicComparison<any>>;

	// Private properties
	private readonly stringified: string;
	private readonly stringifiedSimilarOnly: string;


	/**
	 * Constructor
	 * @param profileOne The first profile
	 * @param profileTwo The second profile
	 */
	constructor(profileOne: Profile, profileTwo: Profile) {
		super(); this.profiles = new UniquePair(profileOne, profileTwo);
		
		// Calculate parameters and add examples
		let score: number = 0, threshold: number = 0, examples: CharacteristicComparison<any>[] = [];
		for (const characteristic of profileOne.characteristics)
			if (characteristic instanceof ComparableCharacteristic) {
				const comparison: CharacteristicComparison<any> | undefined = characteristic.compareToSelfInProfile(profileTwo);
				/*Logger.info(
					characteristic.profile.user.username, "and", characteristic.findSelfInProfile(profileTwo).profile.user.username, "-", characteristic.name, "for",
					comparison.characteristics.one.profile.user.username, "and", comparison.characteristics.two.profile.user.username, "--",
					comparison.characteristics.one.hasData, "|", comparison.characteristics.two.hasData
				);*/
				if (comparison && comparison.characteristics.one.hasData && comparison.characteristics.two.hasData) {
					score += comparison.score * comparison.weight; threshold += comparison.weight;
					// Logger.info(`Adding comparison for ${comparison.characteristics.one.name}: weight: ${comparison.weight}, score: ${comparison.score}`);
					examples.push(comparison);
				}
			}
		this.examples = examples;
		this.similar = (this.score = threshold === 0 ? 0 : score / threshold) >= Configurations.doppelgangster.profile.comparison.scoreThreshold;
		
		// Stringify comparison
		this.stringified = this.stringify(examples);
		this.stringifiedSimilarOnly = this.stringify(examples.filter(comparison => comparison.similar));
	}


	// Public methods
	public toString(similarOnly?: boolean): string { return similarOnly ? this.stringifiedSimilarOnly : this.stringified; }


	// Private methods
	private stringify(examples: CharacteristicComparison<any>[]): string {
		return `[ProfileComparison#${this.score.toFixed(2)}] ${this.profiles.one.user.username} and ${this.profiles.two.user.username} are ${this.similar ? "" : "not "}similar${
			examples.length ? ` {\n${examples.map(comparison => Utilities.String.tabulate(comparison.toString())).join("\n\n")}\n}` : "."
		}`;
	}
}