// Import internal components.
import { _, EventEmitter } from "@/common/classes/mixins";
import { Expirable } from "@/common/classes/mixins/expirable";
import { IMappedObject } from "@/common/interfaces";
import { IExpirable } from "@/common/interfaces/traits";
import { Optional } from "@/common/types";
import { DisableableComponent } from "@/core/base/components";
import { ProfileController } from "@/core/base/controllers";

/**
 * STUB
 */
export class Profile extends EventEmitter(Expirable(_(DisableableComponent)))  {
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
