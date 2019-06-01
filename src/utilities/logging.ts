// Import internal components.
import { ILogger } from "@/common/interfaces";

// Define a basic console logger as the default global logger.
// tslint:disable:no-console
let Logger: ILogger = {
    debug: console.debug,
    error: console.error,
    fatal: (...args: any[]) => console.error("[!!! FATAL !!!]", ...args),
    info: console.info,
    log: console.log,
    trace: console.trace,
    warn: console.warn,
};
// tslint:enable:no-console

/**
 * Set the logger to be used globally.
 * @param logger A logger
 */
function setLogger(logger: ILogger): void {
    Logging.info(`Switching to the ${logger.constructor.name} logger...`);
    Logger = logger;
    Logging.info(`Successfully switched from another logger.`);
}

// Expose components.
export const Logging: ILogger & { setLogger: typeof setLogger } = {
    debug: (...args: any[]) => Logger.debug(...args),
    error: (...args: any[]) => Logger.error(...args),
    fatal: (...args: any[]) => Logger.fatal(...args),
    info: (...args: any[]) => Logger.info(...args),
    log: (...args: any[]) => Logger.log(...args),
    setLogger,
    trace: (...args: any[]) => Logger.trace(...args),
    warn: (...args: any[]) => Logger.warn(...args),
};
