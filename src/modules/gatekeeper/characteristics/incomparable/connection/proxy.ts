// Import Doppelgangster components.
import { Optional } from "@/common/types";
import {
    CharacteristicAnalysis, IncomparableCharacteristic,
} from "@/core/heuristic/characteristic";

// TODO
type Data = boolean;
type Example = boolean;

/**
 * TODO
 */
export default class extends IncomparableCharacteristic<Data, Example> {
    public name = "Connection.Proxy";
    public description = "Whether the user is using a proxy of some sort";
    public weight = 3;

    protected async collector(): Promise<void> {
        return;
    }

    protected analyzer(): Optional<CharacteristicAnalysis<Example>> {
        if (!this.data) {
            return;
        }

        return new CharacteristicAnalysis(
            this,
            this.data ? 1 : 0,
            [this.data],
        );
    }
}
