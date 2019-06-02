// Import internal components.
import { Optional } from "@/common/types";
import { Characteristic } from "@/core/heuristic/characteristic/characteristic";
import {
    CharacteristicAnalysis,
} from "@/core/heuristic/characteristic/characteristic_analysis";
import { Profile } from "@/core/heuristic/profile";

/**
 * TODO
 */
export abstract class IncomparableCharacteristic<DataT, ExampleT> extends Characteristic<DataT> {
    // Private properties
    private _analysis?: CharacteristicAnalysis<ExampleT>;

    /**
     * Construct an IncomparableCharacteristic instance.
     * @param profile A Profile instance
     */
    constructor(public readonly profile: Profile) {
        super(profile);

        this.onMixInComplete(() => {
            this.on("data", () => {
                // Expire the characteristic analysis.
                if (this._analysis) {
                    this._analysis.expire();
                }

                // Expire the profile analysis.
                profile.analysis.expire();
            });
        });
    }

    public get analysis(): Optional<CharacteristicAnalysis<ExampleT>> {
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
    protected abstract analyzer(): Optional<CharacteristicAnalysis<ExampleT>>;
}
