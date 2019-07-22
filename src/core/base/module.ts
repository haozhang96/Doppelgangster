// Import internal components.
import { DisableableComponent } from "@/core/base/components";
import { EntityClass } from "@/core/base/persistence";
import { Doppelgangster } from "@/core/doppelgangster";
import { CharacteristicClass } from "@/core/heuristic/characteristic";
import { CommandClass } from "@/core/interaction/command";

/**
 * TODO
 */
export abstract class Module extends DisableableComponent {
    // @Override
    public readonly characteristics: CharacteristicClass[] = [];
    public readonly commands: CommandClass[] = [];
    public readonly entities: Array<EntityClass<any>> = [];

    /**
     * Construct a Module instance.
     * @param doppelgangster A Doppelgangster instance to attach to
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
