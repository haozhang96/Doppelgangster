// Import internal components.
import { EventEmitter, Expirable, Mix } from "@/common/mixins";
import { IMappedObject } from "@/common/interfaces";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { ProfileController } from "@/core/base/controllers";
import {
    Characteristic, getCharacteristics,
} from "@/core/heuristic/characteristic";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * STUB
 */
export class Profile extends Mix(DisableableComponent)
    .with(EventEmitter)
    .with(Expirable)
.compose() {
    // Public properties
    public readonly characteristics: ReadonlyArray<Characteristic<any>>;
    public readonly user: $Discord.User;
    public readonly userID: string;

    /**
     * Construct a Profile instance.
     * @param controller A ProfileController instance to attach to
     */
    constructor(
        public readonly controller: ProfileController,
        user: $Discord.User | string,
    ) {
        super(controller.doppelgangster);

        // Instantiate all characteristics.
        this.characteristics = getCharacteristics().map((_Characteristic) =>
            new _Characteristic(this),
        );

        // Set the user and userID properties based on the passed argument.
        if (user instanceof $Discord.User) {
            this.user = user;
            this.userID = user.id;
		} else if (this.user = controller.doppelgangster.discord.users.find(_user => _user.id === user)) {
			this.userID = this.user.id;
        } else {
            this.userID = user;
        }
    }

    /**
     * Destroy the Profile instance.
     */
    public destroy(): void {
        // Do nothing for now.
        return;
    }
}
