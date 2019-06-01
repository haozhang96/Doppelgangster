// Import Doppelgangster components.
import { Optional } from "@/common/types";
import {
    CharacteristicAnalysis, IncomparableCharacteristic,
} from "@/core/heuristic/characteristic";
import * as Utilities from "@/utilities";

// Import configurations.
import * as Configs from "?/characteristics/incomparable/account/age";

// STUB
type Data = Date;
type Example = Date;

/**
 * STUB
 */
export default class extends IncomparableCharacteristic<Data, Example> {
    public name = "Account.Age";
    public description = "The user's account age";
    public weight = 5;

    protected async collector(): Promise<void> {
        if (this.profile.user) {
            // Use the createdAt property in discord.js' User object.
            this.data = this.profile.user.createdAt;
        } else {
            // Use the user ID to calculate the account creation date.
            this.data =
                Utilities.discord.getAccountCreationDate(this.profile.userID);
        }
    }

    protected analyzer(): Optional<CharacteristicAnalysis<Example>> {
        if (!this.data) {
            return;
        }

        return new CharacteristicAnalysis(
            this,
            Utilities.math.calculateSimilarity(
                Date.now(),
                this.data.valueOf(),
                Configs.distanceFactor,
            ),
            [this.data],
        );
    }
}
