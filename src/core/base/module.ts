// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { ModuleController } from "@/core/base/controllers";
import { CommandConstructor } from "@/core/interaction/command";

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
        controller.doppelgangster.logger.info(`Instantiating the ${
            this.constructor.name
        } module...`);
    }

    // @Override
    public abstract getCommands(): CommandConstructor[];
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor = typeof Module & (
    new (controller: ModuleController) => Module
);
