// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { Doppelgangster } from "@/core/doppelgangster";
import {
    CharacteristicConstructor,
} from "@/core/heuristic/characteristic/characteristic";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * TODO
 */
export abstract class Module extends DisableableComponent {
    // @Override
    public abstract readonly characteristics: CharacteristicConstructor[];
    public abstract readonly commands: CommandConstructor[];

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
 * Define the Module's constructor type with the abstract property removed.
 */
export type ModuleConstructor = typeof Module & (
    new (doppelgangster: Doppelgangster) => Module
);
