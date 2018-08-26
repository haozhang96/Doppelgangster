import "module-alias/register";
import * as Discord from "discord.js";
import * as $Utilities from "util";

import * as Doppelgangster from "@";
import * as Utilities from "@/Utilities";
import Logger from "@/Logger";


Logger.info(`Versions: Node.js ${process.version.slice(1)}, discord.js ${Discord.version}`);
process.on("uncaughtException", (error: Error) =>
	Logger.warn("Uncaught exception:", Utilities.Miscellaneous.stringifyError(error))
).on("unhandledRejection", (error: Error, promise: Promise<any>) =>
	Logger.warn("Unhandled promise rejection:", Utilities.Miscellaneous.stringifyError(error), $Utilities.inspect(promise))
);
Doppelgangster.initialize(); // Test account switch