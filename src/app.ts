// Enable support for module alias resolution.
import "module-alias/register";

// Import internal components.
import { Doppelgangster } from "@/core";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $Discord from "discord.js";

// Import built-in libraries.
import * as $Utilities from "util";

/**
 * Uncaught exception handling
 */

// Catch uncaught exceptions.
process.on("uncaughtException", (error: Error) =>
    Utilities.logging.warn(
        "Uncaught exception:", Utilities.misc.stringifyError(error),
    ),
);

// Catch unhandled promise rejection exceptions.
process.on("unhandledRejection", (error: unknown, promise: Promise<any>) =>
    Utilities.logging.warn(
        "Unhandled promise rejection:",
        (
            error instanceof Error ?
                Utilities.misc.stringifyError(error)
            :
                error
        ),
        $Utilities.inspect(promise),
    ),
);

/**
 * Initialization
 */

// Display runtime environment version information.
Utilities.logging.info(`Runtime environment: Node.js v${
    process.version.slice(1)
}, discord.js v${
    $Discord.version
}`);

// Display Doppelgangster version information.
Utilities.logging.info(`Initializing Doppelgangster v${
    Doppelgangster.version
})...`);

// Initialize the bot.
export const doppelgangster: Doppelgangster = new Doppelgangster();
