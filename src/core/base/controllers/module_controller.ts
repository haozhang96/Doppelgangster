// Import internal components.
import {
    RegistryController, RegistryControllerConstructor,
} from "@/core/base/controllers/registry_controller";
import { Module, ModuleConstructor } from "@/core/base/module";
import * as Utilities from "@/utilities";

/**
 * TODO
 */
export abstract class ModuleController extends RegistryController<
    ModuleConstructor,
    Module
> { }

/**
 * Define the ModuleController's constructor type with the abstract property
 *   removed.
 */
export type ModuleControllerConstructor =
    RegistryControllerConstructor<typeof ModuleController, ModuleController>;

/**
 * Return all the built-in module classes found in /src/modules.
 */
export function getBuiltInModuleClasses(): ModuleConstructor[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        Utilities.path.sourceRootResolve("modules"),
    );
}
