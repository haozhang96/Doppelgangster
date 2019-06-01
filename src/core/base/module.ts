// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * STUB
 */
export abstract class Module extends DisableableComponent {
    // @Override
    public abstract readonly commands: CommandConstructor[];

    /**
     * Construct a Module instance.
     * @param controller A ModuleController instance to attach to
     */
    constructor(public readonly doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info(`Instantiating the ${
            this.constructor.name
        } module...`);
    }
}

/**
 * Define the module's constructor type with the abstract property removed.
 */
export type ModuleConstructor = typeof Module & (
    new (doppelgangster: Doppelgangster) => Module
);
