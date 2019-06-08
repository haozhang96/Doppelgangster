// Import Doppelgangster components.
import { Optional } from "@/common/types";
import {
    CharacteristicComparison, ComparableCharacteristic,
} from "@/core/heuristic/characteristic";

// Import external libraries.
import * as $Discord from "discord.js";

// TODO
type Data = Map<RegExp, $Discord.Message[]>;
type Example = $Discord.Message;

/**
 * TODO
 */
export default class extends ComparableCharacteristic<Data, Example> {
    public name = "Linguistic.RacialSlurs";
    public description = "The user's usage of racial/ethnic slurs";
    public weight = 4;

    protected async collector(): Promise<void> {
        return;
    }

    protected comparator(): Optional<CharacteristicComparison<Example>> {
        if (this.data === undefined) {
            return;
        }

        /*return new CharacteristicComparison(
            this,
            this.data ? 1 : 0,
            [this.data],
        );*/
    }
}
