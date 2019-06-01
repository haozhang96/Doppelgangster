// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Module, ModuleConstructor } from "@/core/base/module";
import { Doppelgangster } from "@/core/doppelgangster";
import * as Utilities from "@/utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";

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
            getModules(), (_Module) => new _Module(this),
        );
    }

    /**
     * Destroy the ModuleController instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all module instances.
        for (const module of Object.values(this.modules)) {
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
    // Resolve the absolute path to /src/modules.
    const modulesPath: string = Utilities.path.sourceRootResolve("modules");

    // Make sure that the /src/modules folder exists.
    if (!$FileSystem.existsSync(modulesPath)) {
        return {};
    }

    // Create a module map with the first character of the modules' names
    //   uncapitalized.
    const moduleMap: IMappedObject<ModuleConstructor> = {};
    const modules: ModuleConstructor[] =
        Utilities.reflection.getDefaultClassesInDirectory(modulesPath);
    for (const module of modules) {
        moduleMap[Utilities.string.uncapitalize(module.name)] = module;
    }

    return moduleMap;
}
