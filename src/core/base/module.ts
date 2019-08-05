// Import internal components.
import { InstantiableClass } from "@/common/types";
import {
    DisableableComponent, DisableableComponentClass,
} from "@/core/base/components";
import { PersistenceController } from "@/core/base/controllers";
import { EntityClass, RepositoryClass } from "@/core/base/persistence";
import { Doppelgangster } from "@/core/doppelgangster";
import { CharacteristicClass } from "@/core/heuristic/characteristic";
import { CommandClass } from "@/core/interaction/command";
import { getDefaultClassesInDirectory } from "@/utilities/reflection";

/**
 * TODO
 */
export abstract class Module extends DisableableComponent {
    protected static getCharacteristicClasses(
        moduleDirectory: string,
    ): typeof Module.prototype.characteristics {
        return getDefaultClassesInDirectory(moduleDirectory, "characteristics");
    }

    protected static getCommandClasses(
        moduleDirectory: string,
    ): typeof Module.prototype.commands {
        return getDefaultClassesInDirectory(moduleDirectory, "commands");
    }

    protected static getEntityClasses(
        moduleDirectory: string,
        doppelgangster: Doppelgangster,
    ): typeof Module.prototype.entities {
        const entityClasses: typeof Module.prototype.entities = new Map();

        // TODO: Figure out the logic for this
        /*for (const controller of doppelgangster.controllers.persistence) {
            const classes: InstantiableClass[] = getDefaultClassesInDirectory(
                moduleDirectory,
                "persistence",
                controller.name,
            );

            entityClasses.set(
                controller,
                [
                    classes[0] as RepositoryClass<any, any>,
                    classes[1] as EntityClass<any, any>,
                ],
            );
        }*/

        return entityClasses;
    }

    // @Override
    public readonly characteristics: CharacteristicClass[] = [];
    public readonly commands: CommandClass[] = [];
    public readonly entities: Map<
        PersistenceController,
        [RepositoryClass<any, any>, EntityClass<any, any>]
    > = new Map();

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
export type ModuleClass = DisableableComponentClass<typeof Module, Module>;
