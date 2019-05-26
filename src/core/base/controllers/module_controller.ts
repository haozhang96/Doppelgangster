// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { Doppelgangster } from "@/core";
import { Controller, ControllerConstructor } from "@/core/base/controllers";
import { Module, ModuleConstructor } from "@/core/base/module";
import * as Utilities from "@/utilities";

/**
 * STUB
 */
export abstract class ModuleController extends Controller {
    // Public properties
    public readonly modules: Readonly<IMappedObject<Module>>;

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Instantiate all modules.
        this.modules = Utilities.object.mapValues<ModuleConstructor, Module>(
            getModules(), (_Module) => new _Module(doppelgangster),
        );
    }

    /**
     * Destroy the module controller instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all module instances.
        for (const module of global.Object.values(this.modules)) {
            await module.destroy();
        }
    }
}

/**
 * Define the command controller's constructor type with the abstract property
 *   removed.
 */
export type ModuleControllerConstructor =
    ControllerConstructor<typeof ModuleController, ModuleController>;

/**
 * Return all the available modules found in /src/modules.
 */
function getModules(): IMappedObject<ModuleConstructor> {
    const moduleMap: IMappedObject<ModuleConstructor> = {};
    const modules: ModuleConstructor[] =
        Utilities.reflection.getClassesInDirectory(
            Utilities.path.sourceRootResolve("modules"),
        );

    // Create a module map with the first character of the modules' names
    //   uncapitalized.
    for (const module of modules) {
        moduleMap[Utilities.string.uncapitalize(module.name)] = module;
    }

    return moduleMap;
}
