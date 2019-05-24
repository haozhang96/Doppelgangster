// Import external libraries.
import * as $Discord from "discord.js";

// Import built-in libraries.
import { EventEmitter } from "events";

// Import application version from package.json.
import { version as application_version } from "@/../package.json";

/**
 * STUB
 */
export class Doppelgangster extends EventEmitter {
    // Public constants
    public static readonly version: string = application_version;

    // Public variables
    public readonly discord: $Discord.Client;

    constructor() {
        super();

        // Create a new discord.js client.
        const discord: $Discord.Client = this.discord = new $Discord.Client();

        // a
        
    }

    public async destroy(): Promise<void> {
        await this.discord.destroy();
    }
}
