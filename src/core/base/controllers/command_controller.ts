// Import internal components.
import { IDiscordGuildAttachable } from "@/common/interfaces/traits/discord";
import { Doppelgangster } from "@/core";
import { Controller, ControllerConstructor } from "@/core/base/controllers";
import {
    Command, CommandConstructor,
} from "@/core/interaction/command/command";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

/**
 * STUB
 */
export abstract class CommandController extends Controller implements IDiscordGuildAttachable {
    // Public properties
    public readonly commands: readonly Command[];

    // Private properties
    protected readonly _attachedGuilds: $Discord.Guild[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Instantiate all commands.
        this.commands =
            getCommands().map((_Command) => new _Command(this));
    }

    public attachGuild(guild: $Discord.Guild): this {
        if (!this.isGuildAttached(guild)) {
            this._attachedGuilds.push(guild);
        }
        return this;
    }

    public detachGuild(guild: $Discord.Guild): this {
        if (this.isGuildAttached(guild)) {
            this._attachedGuilds.splice(this._attachedGuilds.indexOf(guild), 1);
        }
        return this;
    }

    /**
     * Destroy the command controller instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all command instances.
        for (const command of this.commands) {
            await command.destroy();
        }
    }

    public isGuildAttached(guild: $Discord.Guild): boolean {
        return this._attachedGuilds.includes(guild);
    }
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
