// Import internal components.
import { DiscordGuildAttachable, Mix } from "@/common/mixins";
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Doppelgangster } from "@/core/doppelgangster";
import {
    Command, CommandConstructor, ICommandCallResult,
} from "@/core/interaction/command";
import * as Utilities from "@/utilities";

/**
 * STUB
 */
export abstract class CommandController extends Mix(Controller)
    .with(DiscordGuildAttachable)
.compose() {
    // Public properties
    public readonly commands: Command[] = [];

    /**
     * Construct a CommandController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Instantiate all commands.
        for (const _Command of getCommands()) {
            this.registerCommand(_Command);
        }
    }

    /**
     * Destroy the CommandController instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all command instances.
        for (const command of this.commands) {
            await command.destroy();
        }
    }

    /**
     * Register a command.
     * @param _Command A Command class
     */
    public registerCommand(_Command: CommandConstructor) {
        this.commands.push(new _Command(this));
    }

    // @Override
    protected abstract async handleCommandCall(
        result: ICommandCallResult,
        ...args: any[]
    ): Promise<void>;
}

/**
 * Define the command controller's constructor type with the abstract property
 *   removed.
 */
export type CommandControllerConstructor =
    ControllerConstructor<typeof CommandController, CommandController>;

/**
 * Return all the available commands found in /src/commands.
 */
export function getCommands(): CommandConstructor[] {
    return Utilities.reflection.getClassesInDirectory(
        Utilities.path.sourceRootResolve("commands"),
    );
}
