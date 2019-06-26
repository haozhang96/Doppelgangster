// Import internal components.
import {
    RegistryController, RegistryControllerClass,
} from "@/core/base/controllers/registry_controller";
import {
    Command, CommandClass, ICommandCallResult,
} from "@/core/interaction/command";
import * as Utilities from "@/utilities";

/**
 * TODO
 */
export abstract class CommandController extends RegistryController<
    CommandClass,
    Command
> {
    // @Override
    protected abstract async handleCommandCall(
        result: ICommandCallResult,
        ...args: any[]
    ): Promise<void>;
}

/**
 * Define the CommandController's class type with the abstract property removed.
 */
export type CommandControllerClass =
    RegistryControllerClass<typeof CommandController, CommandController>;

/**
 * Return all the built-in command classes found in /src/commands.
 */
export function getBuiltInCommandClasses(): CommandClass[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        Utilities.path.sourceRootResolve("commands"),
    );
}
