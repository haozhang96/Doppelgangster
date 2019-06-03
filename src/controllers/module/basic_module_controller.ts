// Import internal components.
import {
    getBuiltInModuleClasses, ModuleController,
} from "@/core/base/controllers";
import { Doppelgangster } from "@/core/doppelgangster";
import { CharacteristicConstructor } from "@/core/heuristic/characteristic";
import { CommandConstructor } from "@/core/interaction/command";
import * as Utilities from "@/utilities";

/**
 * The BasicModuleController provides basic module-loading functionalities.
 */
export class BasicModuleController extends ModuleController {
    /**
     * Construct a BasicModuleController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Register built-in modules.
        for (const _Module of getBuiltInModuleClasses()) {
            this.registerInstance(new _Module(doppelgangster));
        }
        doppelgangster.logger.info(
            `Successfully registered ${this.registry.size} built-in ${
                Utilities.string.pluralize("module", this.registry.size)
            }.`,
        );

        // Register all module characteristics and commands.
        doppelgangster.once("controllersReady", (controllers) => {
            // Register module characteristics.
            const moduleCharacteristics: CharacteristicConstructor[][] =
                [...this.registry.values()].map((modules) =>
                    modules.map((module) => module.characteristics),
                ).flat();
            for (const CharacteristicController of controllers.characteristic) {
                for (const characteristics of moduleCharacteristics) {
                    characteristics.forEach(
                        CharacteristicController.registerClass,
                    );
                }
            }

            // Register module commands.
            const moduleCommands: CommandConstructor[][] =
                [...this.registry.values()].map((modules) =>
                    modules.map((module) => module.commands),
                ).flat();
            for (const CommandController of controllers.command) {
                for (const commands of moduleCommands) {
                    commands.forEach(CommandController.registerClass);
                }
            }
        });
    }
}
