// Import internal components.
import { ILogger } from "@/common/interfaces";

// Define a basic console logger as the default global logger.
// tslint:disable:no-console
const defaultLogger: ILogger = {
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
 * Define the interchangeable logger instance that will be used.
 */
let logger: ILogger = defaultLogger;

/**
 * Set the logger to be used globally.
 * @param logger A logger
 */
function setLogger(_logger: ILogger = defaultLogger): void {
    Logging.info(
        `Switching to the ${
            _logger === defaultLogger ? "default" : _logger.constructor.name
        } logger...`,
    );
    const oldLoggerName: string =
        logger === defaultLogger ? "default" : logger.constructor.name;
    logger = _logger;
    Logging.info(`Successfully switched from the ${oldLoggerName} logger.`);
}

// Expose components.
export const Logging: ILogger & { setLogger: typeof setLogger } = {
    debug: (...args: any[]) => logger.debug(...args),
    error: (...args: any[]) => logger.error(...args),
    fatal: (...args: any[]) => logger.fatal(...args),
    info: (...args: any[]) => logger.info(...args),
    log: (...args: any[]) => logger.log(...args),
    setLogger,
    trace: (...args: any[]) => logger.trace(...args),
    warn: (...args: any[]) => logger.warn(...args),
};
