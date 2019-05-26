// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { ModuleController } from "@/core/base/controllers";
import { Logging } from "@/utilities";

/**
 * STUB
 */
export abstract class Module extends DisableableComponent {
    /**
     * Construct a Module instance.
     * @param controller A ModuleController instance to attach to
     */
    constructor(public readonly controller: ModuleController) {
        super(controller.doppelgangster);
        Logging.info(`Instantiating the ${this.constructor.name} module...`);
    }
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor = typeof Module & (
    new (controller: ModuleController) => Module
);
