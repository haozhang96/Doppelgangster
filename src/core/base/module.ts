// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";
import {
    CharacteristicClass,
} from "@/core/heuristic/characteristic/characteristic";
import { CommandClass } from "@/core/interaction/command";

/**
 * TODO
 */
export abstract class Module extends DisableableComponent {
    // @Override
    public abstract readonly characteristics: CharacteristicClass[];
    public abstract readonly commands: CommandClass[];

    /**
     * Construct a Module instance.
     * @param controller A ModuleController instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info(
            `Instantiating the ${this.constructor.name} module...`,
        );
    }
}

/**
 * Define the Module's class type with the abstract property removed.
 */
export type ModuleClass = typeof Module & (
    new (doppelgangster: Doppelgangster) => Module
);
