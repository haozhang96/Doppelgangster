// Import internal components.
import { Optional } from "@/common/types";
import {
    Characteristic, CharacteristicAnalysis,
} from "@/core/heuristic/characteristic";
import { Profile } from "@/core/heuristic/profile";

/**
 * STUB
 */
export abstract class IncomparableCharacteristic<DataT, ExampleT> extends Characteristic<DataT> {
    // Private properties
    private _analysis: Optional<CharacteristicAnalysis<ExampleT>>;

    /**
     * Construct an IncomparableCharacteristic instance.
     * @param profile A Profile instance
     */
    constructor(public readonly profile: Profile) {
        super(profile);

        this.on("data", () => {
            // Expire the characteristic analysis.
            if (this._analysis) {
                this._analysis.expire();
            }

            // Expire the profile analysis.
            profile.analysis.expire();
        });
    }

    public get analysis(): CharacteristicAnalysis<ExampleT> {
        if (!this._analysis || this._analysis.expired) {
            if (this.hasData) {
                this._analysis = this.analyzer();
            } else {
                this._analysis = new CharacteristicAnalysis(this);
            }
        }
        return this._analysis;
    }

    // @Override
    protected abstract analyzer(): Optional<CharacterAnalysis<ExampleT>>;
}
