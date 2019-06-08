// Import internal components.
import { Optional } from "@/common/types";
import { Characteristic } from "@/core/heuristic/characteristic/characteristic";
import {
    CharacteristicComparison,
} from "@/core/heuristic/characteristic/characteristic_comparison";
import { Profile } from "@/core/heuristic/profile";

/**
 * TODO
 */
export abstract class ComparableCharacteristic<DataT, ExampleT> extends Characteristic<DataT> {
    // Private properties
    private readonly _comparisons: Array<CharacteristicComparison<ExampleT>> =
        [];

    /**
     * Construct a ComparableCharacteristic instance.
     * @param profile A Profile instance
     */
    constructor(public readonly profile: Profile) {
        super(profile);

        this.on("data", () => {
            // Expire all characteristic comparisons.
            for (const comparison of this._comparisons) {
                comparison.expire();
            }

            // Expire all profile comparisons.
            for (const comparison of this.profile.comparisons) {
                comparison.expire();
            }
        });
    }

    public compareTo(
        other: this,
    ): Optional<CharacteristicComparison<ExampleT>> {
        const thisComparisonIndex: number =
            this._comparisons.findIndex((comparison) =>
                comparison.characteristics.two === other,
            );
        const otherComparisonIndex: number =
            other._comparisons.findIndex((comparison) =>
                comparison.characteristics.one === this,
            );

        if (
            (
                thisComparisonIndex === -1
                || this._comparisons[thisComparisonIndex].expired
            ) || (
                otherComparisonIndex === -1
                || other._comparisons[otherComparisonIndex].expired
            )
        ) {
            const comparison: Optional<CharacteristicComparison<ExampleT>> =
                this.hasData && other.hasData ?
                    this.comparator(other)
                :
                    new CharacteristicComparison(this, other);

            if (comparison) {
                // Add to this characteristic's comparisons as needed
                if (thisComparisonIndex === -1) {
                    this._comparisons.push(comparison);
                } else { // if (this.comparisons[thisComparisonIndex].expired)
                    this._comparisons[thisComparisonIndex] = comparison;
                }

                // Add to the other characteristic's comparisons as needed
                if (otherComparisonIndex === -1) {
                    other._comparisons.push(comparison);
                } else { // if (otherComparisons[otherComparisonIndex].expired)
                    other._comparisons[otherComparisonIndex] = comparison;
                }
            }

            return comparison;
        } else {
            return this._comparisons[thisComparisonIndex];
        }
    }

    public compareToSelfInProfile(
        other: Profile,
    ): Optional<CharacteristicComparison<ExampleT>> {
        const otherCharacteristic: Optional<this> =
            this.findSelfInProfile(other);

        if (otherCharacteristic) {
            return this.compareTo(otherCharacteristic);
        }
    }

    // @Override
    protected abstract comparator(
        other: this,
    ): Optional<CharacteristicComparison<ExampleT>>;
}
