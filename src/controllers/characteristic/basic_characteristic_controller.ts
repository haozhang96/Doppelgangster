// Import internal components.
import { CharacteristicController } from "@/core/base/controllers";
// import { Doppelgangster } from "@/core/doppelgangster";

// Import built-in libraries.

/**
 * The BasicCharacteristicController provides basic characteristic-marshalling
 *   functionalities.
 */
export class BasicCharacteristicController extends CharacteristicController {
    /**
     * Construct a BasicCharacteristicController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    /*constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);
    }*/

    /**
     * Destroy the BasicCharacteristicController instance.
     */
    public destroy(): void {
        return;
    }
}
