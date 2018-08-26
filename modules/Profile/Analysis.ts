import { Profile, IncomparableCharacteristic, CharacteristicAnalysis } from "@";
import { Expirable } from "@/Classes/Expirable";
import { IScored, IExemplifiable } from "@/Interfaces";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";
import Configurations from "Configurations";


export class ProfileAnalysis extends Expirable implements IScored, IExemplifiable<CharacteristicAnalysis<any>> {
	// Public properties
	public readonly profile: Profile;
	public readonly score: number;
	public readonly suspicious: boolean;
	public readonly examples: ReadonlyArray<CharacteristicAnalysis<any>>;

	// Private properties
	private readonly stringified: string;
	private readonly stringifiedSuspiciousOnly: string;


	/**
	 * Constructor
	 * @param profile The profile
	 */
    constructor(profile: Profile) {
		super(); this.profile = profile;
		
		// Calculate parameters and add examples
		let score: number = 0, threshold: number = 0, examples: CharacteristicAnalysis<any>[] = [];
		for (const characteristic of this.profile.characteristics)
			if (characteristic instanceof IncomparableCharacteristic && characteristic.hasData) {
				const analysis: CharacteristicAnalysis<any> = characteristic.analysis;
				score += analysis.score * analysis.weight; threshold += analysis.weight;
				// Logger.info(`Adding ${characteristic.name}: score: ${analysis.score}, weight: ${analysis.weight}`);
				examples.push(analysis);
			}
		this.examples = examples;
		this.suspicious = (this.score = score / threshold) >= Configurations.doppelgangster.profile.analysis.scoreThreshold;

		// Stringify analysis
		this.stringified = this.stringify(examples);
		this.stringifiedSuspiciousOnly = this.stringify(examples.filter(analysis => analysis.suspicious));
	}
	

	// Public methods
	public toString(suspiciousOnly?: boolean): string { return suspiciousOnly ? this.stringifiedSuspiciousOnly : this.stringified; }


	// Private methods
	private stringify(examples: CharacteristicAnalysis<any>[]): string {
		return `[ProfileAnalysis#${this.score.toFixed(2)}] ${this.profile.user.username} is ${this.suspicious ? "" : "not "}suspicious${
			examples.length ? ` {\n${examples.map(analysis => Utilities.String.tabulate(analysis.toString())).join("\n\n")}\n}` : "."
		}`;
	}
}