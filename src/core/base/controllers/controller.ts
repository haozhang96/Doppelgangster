// Import internal components.
import { Component, ComponentClass } from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";

/**
 * TODO
 */
export abstract class Controller extends Component {
    /**
     * Construct a Controller instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info(
            `Initializing the ${this.constructor.name} controller...`,
        );
    }
}

/**
 * Define the Controller's class type with the abstract property removed.
 */
export type ControllerClass<
    ClassT = typeof Controller,
    InstanceT = Controller
> = ComponentClass<ClassT, InstanceT>;
