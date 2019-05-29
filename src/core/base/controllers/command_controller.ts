// Import internal components.
import { IDiscordGuildAttachable } from "@/common/interfaces/traits/discord";
import { Doppelgangster } from "@/core";
import { Controller, ControllerConstructor } from "@/core/base/controllers";
import {
    Command, CommandConstructor, ICommandCallResult,
} from "@/core/interaction/command";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * STUB
 */
export abstract class CommandController extends Controller implements IDiscordGuildAttachable {
    // Public properties
    public readonly commands: readonly Command[];

    // Protected properties
    protected readonly attachedGuilds: $Discord.Guild[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Instantiate all commands.
        this.commands = getCommands().map((_Command) => new _Command(this));
    }

    public attachGuild(guild: $Discord.Guild): this {
        if (!this.isGuildAttached(guild)) {
            this.attachedGuilds.push(guild);
        }
        return this;
    }

    public detachGuild(guild: $Discord.Guild): this {
        if (this.isGuildAttached(guild)) {
            this.attachedGuilds.splice(this.attachedGuilds.indexOf(guild), 1);
        }
        return this;
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

    public isGuildAttached(guild: $Discord.Guild): boolean {
        return this.attachedGuilds.includes(guild);
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
