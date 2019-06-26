// Import internal components.
import {
    RegistryController, RegistryControllerClass,
} from "@/core/base/controllers/registry_controller";
import {
    Characteristic, CharacteristicClass,
} from "@/core/heuristic/characteristic";
import * as Utilities from "@/utilities";

/**
 * TODO
 */
export abstract class CharacteristicController extends RegistryController<
    CharacteristicClass,
    Characteristic<any>
> { }

/**
 * Define the CharacteristicController's class type with the abstract property
 *   removed.
 */
export type CharacteristicControllerClass = RegistryControllerClass<
    typeof CharacteristicController,
    CharacteristicController
>;

/**
 * Return all the built-in characteristic classes found in /src/characteristics.
 */
export function getBuiltInCharacteristicClasses(): CharacteristicClass[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        Utilities.path.sourceRootResolve("characteristics"),
    );
}
