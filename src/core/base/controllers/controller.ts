// Import internal components.
import { Component, ComponentConstructor } from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";
import { Logging } from "@/utilities";

/**
 * STUB
 */
export abstract class Controller extends Component {
    /**
     * Construct a Controller instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);
        Logging.info(`Instantiating the ${
            this.constructor.name
        } controller...`);
    }
}

/**
 * Define the controller's constructor type with the abstract property removed.
 */
export type ControllerConstructor<
    ClassT = typeof Controller,
    InstanceT = Controller
> = ComponentConstructor<ClassT, InstanceT>;
