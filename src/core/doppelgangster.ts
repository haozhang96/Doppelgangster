// Import internal components.
import { ILogger, IMappedObject } from "@/common/interfaces";
import { IDestructible } from "@/common/interfaces/traits";
import { Optional } from "@/common/types";
import {
    Controller, ControllerConstructor, LoggingController,
} from "@/core/base/controllers";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

// Import built-in libraries.
import { EventEmitter } from "events";

// Import configurations.
import * as ControllerConfigs from "?/controllers";
import * as DiscordConfigs from "?/discord";

// Import the application version from package.json.
import { version as application_version } from "@/../package.json";

/**
 * STUB
 */
export class Doppelgangster extends EventEmitter implements IDestructible {
    // Public constants
    public static readonly version: string = application_version;

    // Public variables
    public readonly discord: $Discord.Client;
    public readonly controllers: Readonly<IMappedObject<Controller>>;

    public get logger(): ILogger {
        return Object.values(this.controllers).find((_controller) =>
            _controller instanceof LoggingController,
        ) as Optional<LoggingController> || Utilities.logging;
    }

    constructor() {
        super();

        // Instantiate all controllers.
        this.controllers =
            Utilities.object.mapValues<ControllerConstructor, Controller>(
                ControllerConfigs.controllers,
                (_Controller) => new _Controller(this),
            );

        // Create a new discord.js client.
        const discord: $Discord.Client = this.discord = new $Discord.Client();

        // Log into Discord.
        discord.login(DiscordConfigs.api_token);
    }

    public async destroy(): Promise<void> {
        // Destroy all controller instances.
        for (const controller of Object.values(this.controllers)) {
            await controller.destroy();
        }

        // Destroy the discord.js client.
        await this.discord.destroy();
    }
}
