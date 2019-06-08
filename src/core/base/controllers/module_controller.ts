// Import internal components.
import {
    RegistryController, RegistryControllerConstructor,
} from "@/core/base/controllers/registry_controller";
import { Module, ModuleConstructor } from "@/core/base/module";
import * as Utilities from "@/utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

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
 * The modules must export a default class from their index.ts.
 */
export function getBuiltInModuleClasses(): ModuleConstructor[] {
    const modulesDirectory: string =
        Utilities.path.sourceRootResolve("modules");
    return $FileSystem.readdirSync(
        modulesDirectory,
    ).map((file) =>
        $Path.resolve(modulesDirectory, file),
    ).filter((file) =>
        $FileSystem.statSync(file).isDirectory(),
    ).map((directory) =>
        require(directory).default,
    );
}
