import { Profile, CharacteristicComparison } from "@";
import { Characteristic } from "@/Characteristic";  // Needs to be separate to prevent circular dependency
// import Logger from "@/Logger";


export abstract class ComparableCharacteristic<DataT, ExampleT> extends Characteristic<DataT> {
	// Private properties
	private readonly comparisons: CharacteristicComparison<ExampleT>[] = [];


	/**
	 * Constructor
	 * @param profile The profile
	 * @param data Characteristic data
	 */
	constructor(profile: Profile, data?: DataT) {
		super(profile, data);
		this.on("data", () => {
			// Logger.info("New data for", this.profile.user.username, "-", this.name, "--", this.data);

			// Expire characteristic comparisons
			for (const comparison of this.comparisons)
				comparison.expire();

			// Expire all profile comparisons
			for (const profileComparison of this.profile.comparisons)
				profileComparison.expire();
		});
	}


	// Public methods
	public compareTo(otherCharacteristic: this): CharacteristicComparison<ExampleT> | undefined {
		// const otherComparisons: CharacteristicComparison<ExampleT>[] = this.findSelfInProfile(otherCharacteristic.profile).comparisons;
		const thisComparisonIndex: number = this.comparisons.findIndex(comparison => comparison.characteristics.two === otherCharacteristic);
		const otherComparisonIndex: number = otherCharacteristic.comparisons.findIndex(comparison => comparison.characteristics.one === this);

		if ((thisComparisonIndex === -1 || this.comparisons[thisComparisonIndex].expired) || (otherComparisonIndex === -1 || otherCharacteristic.comparisons[otherComparisonIndex].expired)) {
			const comparison: CharacteristicComparison<ExampleT> | undefined =
				this.hasData && otherCharacteristic.hasData ? this.comparator(otherCharacteristic) : new CharacteristicComparison(this, otherCharacteristic);
			
			if (comparison) {
				// Add to this characteristic's comparisons as needed
				if (thisComparisonIndex === -1)
					this.comparisons.push(comparison);
				else // if (this.comparisons[thisComparisonIndex].expired)
					this.comparisons[thisComparisonIndex] = comparison;
				
				// Add to the other characteristic's comparisons as needed
				if (otherComparisonIndex === -1)
					otherCharacteristic.comparisons.push(comparison);
				else // if (otherComparisons[otherComparisonIndex].expired)
					otherCharacteristic.comparisons[otherComparisonIndex] = comparison;
			}

			return comparison;
		} else return this.comparisons[thisComparisonIndex];
	}

	public compareToSelfInProfile(profile: Profile): CharacteristicComparison<ExampleT> | undefined {
		const otherCharacteristic: this | undefined = this.findSelfInProfile(profile);
		if (otherCharacteristic) return this.compareTo(otherCharacteristic);
	}


	// Extensible methods
	protected abstract comparator(otherCharacteristic: this): CharacteristicComparison<ExampleT> | undefined;
}