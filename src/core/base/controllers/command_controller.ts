// Import internal components.
import {
    RegistryController, RegistryControllerConstructor,
} from "@/core/base/controllers/registry_controller";
import {
    Command, CommandConstructor, ICommandCallResult,
} from "@/core/interaction/command";
import * as Utilities from "@/utilities";

/**
 * TODO
 */
export abstract class CommandController extends RegistryController<
    CommandConstructor,
    Command
> {
    // @Override
    protected abstract async handleCommandCall(
        result: ICommandCallResult,
        ...args: any[]
    ): Promise<void>;
}

/**
 * Define the CommandController's constructor type with the abstract property
 *   removed.
 */
export type CommandControllerConstructor =
    RegistryControllerConstructor<typeof CommandController, CommandController>;

/**
 * Return all the built-in command classes found in /src/commands.
 */
export function getBuiltInCommandClasses(): CommandConstructor[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        Utilities.path.sourceRootResolve("commands"),
    );
}
