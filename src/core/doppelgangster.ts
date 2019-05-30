// Import internal components.
import { ILogger, IMappedObject } from "@/common/interfaces";
import { IDestructible } from "@/common/interfaces/traits";
import { Callback } from "@/common/types";
import * as Controllers from "@/core/base/controllers";
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
    public readonly controllers: Readonly<IControllers>;
    public readonly logger: Readonly<ILogger> = {
        debug: (...$) => this._loggers.forEach(async (_) => _.debug(...$)),
        error: (...$) => this._loggers.forEach(async (_) => _.error(...$)),
        fatal: (...$) => this._loggers.forEach(async (_) => _.fatal(...$)),
        info: (...$) => this._loggers.forEach(async (_) => _.info(...$)),
        log: (...$) => this._loggers.forEach(async (_) => _.log(...$)),
        trace: (...$) => this._loggers.forEach(async (_) => _.trace(...$)),
        warn: (...$) => this._loggers.forEach(async (_) => _.warn(...$)),
    };

    // Private variables
    private readonly _loggers: readonly ILogger[] = [Utilities.logging];

    /**
     * Construct a Doppelgangster instance.
     */
    constructor(apiToken: string = DiscordConfigs.apiToken) {
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
            Utilities.object.mapValues<
                Controllers.ControllerConstructor[], Controllers.Controller[]
            >(
                ControllerConfigs.controllers,
                (ControllerArray) => ControllerArray.map((_Controller) =>
                    new _Controller(this),
                ),
            ) as IControllers;

        // Replace the default logger with the logging controllers.
        if (this.controllers.logging.length) {
            this._loggers = this.controllers.logging as unknown as ILogger[];
        }

        // Create a new discord.js client.
        const discord: $Discord.Client = this.discord = new $Discord.Client();

        // Log into Discord.
        discord.login(apiToken);
    }

    /**
     * Destroy the Doppelgangster instance.
     */
    public async destroy(): Promise<void> {
        // Destroy all controller instances.
        for (const typedControllers of Object.values(this.controllers)) {
            for (const controller of typedControllers) {
                await controller.destroy();
            }
        }

        // Destroy the discord.js client.
        await this.discord.destroy();
    }
}

/**
 * Define a map holding multiple instances of different types of controllers.
 */
interface IControllers extends IMappedObject<Controllers.Controller[]> {
    authorization: Controllers.AuthorizationController[];
    characteristic: Controllers.CharacteristicController[];
    command: Controllers.CommandController[];
    logging: Controllers.LoggingController[];
    module: Controllers.ModuleController[];
    persistence: Controllers.PersistenceController[];
    profile: Controllers.ProfileController[];
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
