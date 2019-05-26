// Import internal components.
import {
    DisableableComponent, DisableableComponentConstructor,
} from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";
import { Logging } from "@/utilities";

/**
 * STUB
 */
export abstract class Module extends DisableableComponent {
    /**
     * Construct a Module instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);
        Logging.info(`Instantiating the ${this.constructor.name} module...`);
    }
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor =
    DisableableComponentConstructor<typeof Module, Module>;
