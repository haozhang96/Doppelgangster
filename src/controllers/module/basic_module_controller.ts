// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { ModuleController } from "@/core/base/controllers";
import { Module, ModuleConstructor } from "@/core/base/module";
import { Doppelgangster } from "@/core/doppelgangster";
import { CommandConstructor } from "@/core/interaction/command";
import * as Utilities from "@/utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

/**
 * The BasicModuleController provides basic functionalities defined in the base
 *   ModuleController.
 */
export class BasicModuleController extends ModuleController {
    // Public properties
    public readonly modules: Readonly<IMappedObject<Module>>;

    /**
     * Construct a BasicModuleController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Instantiate all modules.
        this.modules = Utilities.object.mapValues<ModuleConstructor, Module>(
            getModules(), (_Module) => new _Module(doppelgangster),
        );

        // Register all module commands.
        const moduleCommands: CommandConstructor[][] =
            Object.values(this.modules).map((module) => module.commands);
        doppelgangster.once("controllersReady", (controllers) => {
            for (const CommandController of controllers.command) {
                for (const commands of moduleCommands) {
                    for (const command of commands) {
                        CommandController.registerCommand(command);
                    }
                }
            }
        });
    }
}

/**
 * Return all the available modules found in /src/modules.
 */
function getModules(): IMappedObject<ModuleConstructor> {
    // Resolve the absolute path to /src/modules.
    const moduleMap: IMappedObject<ModuleConstructor> = {};
    const modulesPath: string = Utilities.path.sourceRootResolve("modules");

    // Make sure that the /src/modules folder exists.
    if (!$FileSystem.existsSync(modulesPath)) {
        return moduleMap;
    }

    // Use all the modules' default exports as the module constructors.
    const modules: ModuleConstructor[] =
        $FileSystem.readdirSync(modulesPath).map((file) =>
            $Path.resolve(modulesPath, file),
        ).filter((file) =>
            $FileSystem.statSync(file).isDirectory(),
        ).map((moduleFolder) =>
            require(moduleFolder).default,
        );

    // Create a module map with the first character of the modules' names
    //   uncapitalized.
    for (const module of modules) {
        moduleMap[Utilities.string.uncapitalize(module.name)] = module;
    }

    return moduleMap;
}
