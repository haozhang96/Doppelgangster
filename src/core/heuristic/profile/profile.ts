// Import internal components.
import { EventEmitter, Expirable, Mix } from "@/common/mixins";
import { IMappedObject } from "@/common/interfaces";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { ProfileController } from "@/core/base/controllers";

/**
 * STUB
 */
export class Profile extends
    Mix(DisableableComponent)
    .with(EventEmitter)
    .with(Expirable)
.done() {
    /**
     * Construct a Profile instance.
     * @param controller A ProfileController instance to attach to
     */
    constructor(public readonly controller: ProfileController) {
        super(controller.doppelgangster);
    }

    /**
     * Destroy the Profile instance.
     */
    public destroy(): void {
        // Do nothing for now.
        return;
    }
}
