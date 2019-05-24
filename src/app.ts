// Enable support for module alias resolution.
import "module-alias/register";

// Import internal components.
import { Doppelgangster } from "@/core/doppelgangster";
import * as Utilities from "@/utilities";

// Import external components.
import * as $Discord from "discord.js";
import * as $Utilities from "util";

/**
 * Uncaught exception handling
 */

// Catch uncaught exceptions.
process.on("uncaughtException", (error: Error) =>
    Utilities.logging.warn(
        "Uncaught exception:",
        Utilities.miscellaneous.stringifyError(error),
    ),
);

// Catch unhandled promise rejection exceptions.
process.on("unhandledRejection", (error: unknown, promise: Promise<any>) =>
    Utilities.logging.warn(
        "Unhandled promise rejection:",
        (
            error instanceof Error ?
                Utilities.miscellaneous.stringifyError(error)
            :
                error
        ),
        $Utilities.inspect(promise),
    ),
);

/**
 * Initialization
 */

// Display version information.
Utilities.logging.info(`Versions: Node.js ${
    process.version.slice(1)
}, discord.js ${
    $Discord.version
}`);

// Initialize the bot.
Doppelgangster.initialize();
