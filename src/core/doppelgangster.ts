// Import internal components.
import { ILogger, IMappedObject } from "@/common/interfaces";
import { IDestructible } from "@/common/interfaces/traits";
import { DiscordGuildAttachable, Mix } from "@/common/mixins";
import { Callback, Optional } from "@/common/types";
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
import * as Configs from "?/doppelgangster";

// Import the application version from package.json.
import { version as application_version } from "@/../package.json";

/**
 * STUB
 */
export class Doppelgangster extends Mix(EventEmitter)
    .with(DiscordGuildAttachable)
.compose() implements IDestructible {
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
        this.logger.info(`Runtime environment: Doppelgangster v${
            Doppelgangster.version
        }, Node.js v${
            process.version.slice(1)
        }, discord.js v${
            $Discord.version
        }`);
        this.logger.info("Initializing Doppelgangster...");

        // Call the destructor on Node process exit.
        process.on("exit", this.destroy);

        // Create a new discord.js client.
        this.discord = new $Discord.Client();

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
            Utilities.logging.setLogger(this._loggers[0]);
        }

        // Create a login callback that can be used for reconnection in case of
        //   disconnection.
        let reconnecting: boolean;
        const connectToDiscord: Callback = async () => {
            try {
                this.logger.info("Connecting to Discord...");
                await this.discord.login(apiToken);
                this.logger.info("Successfully connected to Discord.");
                this.emit("ready");
            } catch (error) {
                this.logger.error(
                    "Failed to connect to Discord:",
                    Utilities.misc.stringifyError(error),
                );
            } finally {
                reconnecting = false;
            }
        };

        // Attempt to reconnect to Discord if the bot becomes disconnected.
        this.discord.on("disconnect", () => {
            if (!reconnecting) {
                reconnecting = true;
                this.logger.error(
                    "Doppelgangster has been disconnected from Discord!",
                );
                this.logger.info(
                    `Attempting to reconnect to Discord in ${
                        Math.round(DiscordConfigs.reconnectTimeout / 1000)
                    } seconds...`,
                );
                setTimeout(connectToDiscord, DiscordConfigs.reconnectTimeout);
            }
        });

        // Log Discord errors to the logger.
        this.discord.on("error", (error) => {
            this.logger.error(
                "Discord has encountered an error:",
                Utilities.misc.stringifyError(error),
            );
        });

        // Attach a listener to perform actions after logging into Discord.
        this.discord.on("ready", () => {
            for (const guildID of Configs.guildIDs) {
                const guild: Optional<$Discord.Guild> =
                    this.discord.guilds.get(guildID);

                if (guild) {
                    this.attachGuild(guild);
                }
            }
        });

        // Log into Discord.
        connectToDiscord();
    }

    public attachGuild(guild: $Discord.Guild): this {
        this.logger.log(`Attaching to Discord guild "${guild.name}"...`);

        // Attach command controllers.
        for (const CommandController of this.controllers.command) {
            CommandController.attachGuild(guild);
        }

        return super.attachGuild(guild);
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

    public detachGuild(guild: $Discord.Guild): this {
        this.logger.log(`Detaching from Discord guild "${guild.name}"...`);

        // Detach command controllers.
        for (const CommandController of this.controllers.command) {
            CommandController.detachGuild(guild);
        }

        return super.detachGuild(guild);
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
