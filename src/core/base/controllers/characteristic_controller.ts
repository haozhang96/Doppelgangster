// Import internal components.
import {
    RegistryController, RegistryControllerConstructor,
} from "@/core/base/controllers/registry_controller";
import {
    Characteristic, CharacteristicConstructor,
} from "@/core/heuristic/characteristic";
import * as Utilities from "@/utilities";

/**
 * TODO
 */
export abstract class CharacteristicController extends RegistryController<
    CharacteristicConstructor,
    Characteristic<any>
> { }

/**
 * Define the CharacteristicController's constructor type with the abstract
 *   property removed.
 */
export type CharacteristicControllerConstructor = RegistryControllerConstructor<
    typeof CharacteristicController,
    CharacteristicController
>;

/**
 * Return all the built-in characteristic classes found in /src/characteristics.
 */
export function getBuiltInCharacteristicClasses(): CharacteristicConstructor[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        Utilities.path.sourceRootResolve("characteristics"),
    );
}
