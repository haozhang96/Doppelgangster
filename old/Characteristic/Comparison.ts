// import * as $Utilities from "util";

import { ComparableCharacteristic } from "@";
import { Expirable } from "@/Classes/Expirable";
import { Pair, UniquePair } from "@/Classes/Pair";
import { IScored, IWeighted, IExemplifiable } from "@/Interfaces";
import Configurations from "Configurations";


export class CharacteristicComparison<ExampleT> extends Expirable implements IScored, IWeighted, IExemplifiable<Pair<ExampleT>> {
	// Public properties
	public readonly characteristics: UniquePair<ComparableCharacteristic<any, ExampleT>>;
	public readonly score: number;
	public readonly weight: number;
	public readonly similar: boolean;
	public readonly examples: ReadonlyArray<Pair<ExampleT>>;

	// Private properties
	private readonly stringified: string;


	/**
	 * Constructor
	 * @param characteristicOne The first characteristic
	 * @param characteristicTwo The second characteristic
	 * @param score The score of the comparison
	 */
	constructor(
		characteristicOne: ComparableCharacteristic<any, ExampleT>,
		characteristicTwo: ComparableCharacteristic<any, ExampleT>,
		score: number = 0,
		examples: Pair<ExampleT>[] = [],
		exampleStringifier?: (example: ExampleT) => string
	) {
		super(); this.characteristics = new UniquePair(characteristicOne, characteristicTwo);

		// Set parameters and examples
		this.score = score; this.weight = characteristicOne.weight;
		this.similar = score >= Configurations.doppelgangster.characteristic.comparison.scoreThreshold;
		this.examples = examples;

		// Stringify comparison
		const maxUsernameLength: number = Math.max(this.characteristics.one.profile.user.username.length, this.characteristics.two.profile.user.username.length);
		this.stringified = `[CharacteristicComparison#${this.score.toFixed(2)}] {\n\tFor: ${this.characteristics.one}\n\tSimilar: ${this.similar ? "Yes" : "No"}\n\tExamples: ${this.examples.length ?
			`[\n\t\t{\n\t\t\t${this.examples.map(example =>
				`[${this.characteristics.one.profile.user.username.padEnd(maxUsernameLength)}] ${
					(exampleStringifier ? exampleStringifier(example.one) : example.one.toString()).replace(/\n/g, "\n\t\t\t")
				}\n\t\t\t[${this.characteristics.two.profile.user.username.padEnd(maxUsernameLength)}] ${
					(exampleStringifier ? exampleStringifier(example.two) : example.two.toString()).replace(/\n/g, "\n\t\t\t")
				}`
			).join("\n\t\t},\n\t\t{\n\t\t\t")}\n\t\t}\n\t]`
		: "None"}\n}`;
	}


	// Public methods
    public toString(): string { return this.stringified; }
}