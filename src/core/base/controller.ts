// Import internal components.
import { IMappedObject } from "@/common/interfaces"
import { IDestructible } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core/doppelgangster";
import { Logging } from "@/utilities";

/**
 * STUB
 */
export abstract class Controller implements IDestructible {
    /**
     * Construct a Controller instance.
     * @param doppelgangster A Doppelgangster instance
     */
    constructor(public doppelgangster: Doppelgangster) {
        Logging.info(`Instantiating the ${
            this.constructor.name
        } controller...`);
    }

    // @Override
    public abstract destroy(): void;
}

/**
 * Define the controller's constructor type with the abstract property removed.
 */
export type ControllerConstructor =
    typeof Controller & (new (doppelgangster: Doppelgangster) => Controller);

/**
 * Return all the available controllers. These are currently hard-coded.
 */
export function getControllers(): IMappedObject<ControllerConstructor> {
    return {};
}
