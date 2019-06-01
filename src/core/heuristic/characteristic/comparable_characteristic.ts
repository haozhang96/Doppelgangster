// Import internal components.
import { Optional } from "@/common/types";
import { Characteristic } from "@/core/heuristic/characteristic/characteristic";
import {
    CharacteristicComparison,
} from "@/core/heuristic/characteristic/characteristic_comparison";
import { Profile } from "@/core/heuristic/profile";

/**
 * STUB
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
        return;
    }

    // @Override
    protected abstract comparator(
        other: this,
    ): Optional<CharacteristicComparison<ExampleT>>;
}
