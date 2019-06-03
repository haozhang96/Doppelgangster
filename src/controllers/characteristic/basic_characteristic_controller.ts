// Import internal components.
import {
    CharacteristicController, getBuiltInCharacteristicClasses,
} from "@/core/base/controllers";
import { Doppelgangster } from "@/core/doppelgangster";
import * as Utilities from "@/utilities";

/**
 * The BasicCharacteristicController provides basic characteristic-marshalling
 *   functionalities.
 */
export class BasicCharacteristicController extends CharacteristicController {
    /**
     * Construct a BasicCharacteristicController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Register built-in characteristics.
        for (const _Characteristic of getBuiltInCharacteristicClasses()) {
            this.registerClass(_Characteristic);
        }
        doppelgangster.logger.info(
            `Successfully registered ${this.registry.size} built-in ${
                Utilities.string.pluralize("characteristic", this.registry.size)
            }.`,
        );
    }
}
