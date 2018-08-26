// import * as $Utilities from "util";

import { IncomparableCharacteristic } from "@";
import { Expirable } from "@/Classes/Expirable";
import { IScored, IWeighted, IExemplifiable } from "@/Interfaces";
import Configurations from "Configurations";


export class CharacteristicAnalysis<ExampleT> extends Expirable implements IScored, IWeighted, IExemplifiable<ExampleT> {
	// Public properties
	public readonly characteristic: IncomparableCharacteristic<any, ExampleT>;
    public readonly score: number;
    public readonly weight: number;
    public readonly suspicious: boolean;
    public readonly examples: ReadonlyArray<ExampleT>;

    // Private properties
	private readonly stringified: string;


    /**
     * Constructor
     * @param characteristic The characteristic
     * @param score The score of the analysis
     */
	constructor(
        characteristic: IncomparableCharacteristic<any, ExampleT>,
        score: number = 0,
        examples: ExampleT[] = [],
        exampleStringifier?: (example: ExampleT) => string
    ) {
        super(); this.characteristic = characteristic;

        // Set parameters and examples
        this.score = score; this.weight = characteristic.weight;
		this.suspicious = score >= Configurations.doppelgangster.characteristic.analysis.scoreThreshold;
        this.examples = examples;

        // Stringify analysis
        this.stringified = `[CharacteristicAnalysis#${this.score.toFixed(2)}] {\n\tFor: ${this.characteristic}\n\tSuspicious: ${this.suspicious ? "Yes" : "No"}\n\tExamples: ${this.examples.length ?
			`[\n\t\t${this.examples.map(example => (exampleStringifier ? exampleStringifier(example) : example + "").replace(/\n/g, "\n\t\t\t")).join("\n\t\t")}\n\t]`
		: "None"}\n}`;
    }


    // Public methods
    public toString(): string { return this.stringified; }
}