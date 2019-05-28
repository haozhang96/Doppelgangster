// Import internal components.
import { ILogger, IMappedObject } from "@/common/interfaces";
import { IDestructible } from "@/common/interfaces/traits";
import { Callback, Optional } from "@/common/types";
import {
    Controller, ControllerConstructor, LoggingController,
} from "@/core/base/controllers";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

// Import built-in libraries.
import { EventEmitter } from "events";
import * as $Utilities from "util";

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

    public static suppressUncaughtExceptions(): void {
        process.on("uncaughtException", uncaughtExceptionHandler);
        process.on("unhandledRejection", uncaughtPromiseRejectionHandler);
    }

    public static unsuppressUncaughtExceptions(): void {
        process.off("uncaughtException", uncaughtExceptionHandler);
        process.off("unhandledRejection", uncaughtPromiseRejectionHandler);
    }

    // Public variables
    public readonly discord: $Discord.Client;
    public readonly controllers: Readonly<IMappedObject<Controller>>;

    /**
     * STUB
     */
    public get logger(): ILogger {
        return Object.values(this.controllers).find((_controller) =>
            _controller instanceof LoggingController,
        ) as Optional<LoggingController> || Utilities.logging;
    }

    constructor() {
        super();

        // Display runtime environment version information.
        this.logger.info("Initializing Doppelgangster...");
        this.logger.info(`Runtime environment: Doppelgangster v${
            Doppelgangster.version
        }, Node.js v${
            process.version.slice(1)
        }, discord.js v${
            $Discord.version
        }`);

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

/**
 * Define a handler to catch uncaught exceptions.
 * @param error The uncaught error
 */
const uncaughtExceptionHandler: Callback =
    (error: Error) => Utilities.logging.warn(
        "Uncaught exception:", Utilities.misc.stringifyError(error),
    );

/**
 * Define a handler to catch uncaught promise rejection exceptions.
 * @param error The uncaught error
 * @param promise The promise object that caused the error
 */
const uncaughtPromiseRejectionHandler: Callback =
    (error: unknown, promise: Promise<any>) => Utilities.logging.warn(
        "Unhandled promise rejection:",
        error instanceof Error ? Utilities.misc.stringifyError(error) : error,
        $Utilities.inspect(promise),
    );
