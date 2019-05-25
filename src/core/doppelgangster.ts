// Import internal components.
import { IDestructible } from "@/common/interfaces/traits";
import { getModules, Module } from "./module";

// Import external libraries.
import * as $Discord from "discord.js";

// Import built-in libraries.
import { EventEmitter } from "events";

// Import configurations.
import { Discord } from "?/discord";

// Import application version from package.json.
import { version as application_version } from "@/../package.json";

/**
 * STUB
 */
export class Doppelgangster extends EventEmitter implements IDestructible {
    // Public constants
    public static readonly version: string = application_version;

    // Public variables
    public readonly discord: $Discord.Client;
    public readonly modules: readonly Module[];

    constructor() {
        super();

        // Create a new discord.js client.
        const discord: $Discord.Client = this.discord = new $Discord.Client();

        // ?
        discord.login(Discord.api_token);

        // Instantiate all enabled module instances.
        this.modules = getModules().filter((_Module) =>
            _Module.enabled,
        ).map((_Module) =>
            new _Module(this),
        );

        return;
    }

    public async destroy(): Promise<void> {
        // Destroy all modules.
        for (const module of this.modules) {
            await module.destroy();
        }

        // Destroy the discord.js client.
        await this.discord.destroy();
    }
}
