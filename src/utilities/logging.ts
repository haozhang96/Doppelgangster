// Import internal components.
import { ILogger } from "@/common/interfaces";

// Define a basic console logger as the default global logger.
// tslint:disable: no-console
const defaultLogger: ILogger = {
    debug: console.debug,
    error: console.error,
    fatal: (...args: any[]) => console.error("[!!! FATAL !!!]", ...args),
    info: console.info,
    log: console.log,
    trace: console.trace,
    warn: console.warn,
};
// tslint:enable: no-console

/**
 * Define the interchangeable logger instance that will be used.
 */
let logger: ILogger = defaultLogger;

/**
 * Get the name of an arbitrary logger object.
 * @param _logger A logger object
 */
function getLoggerName(_logger: ILogger): string {
    if (_logger === defaultLogger) {
        return "the default";
    } else if (_logger.constructor instanceof Function) {
        return _logger.constructor.name;
    } else {
        return "another";
    }
}

/**
 * Set the logger to be used globally.
 * @param logger A logger object
 */
export function setLogger(_logger: ILogger = defaultLogger): void {
    Logging.info(`Switching to ${getLoggerName(_logger)} logger...`);
    const oldLoggerName: string = getLoggerName(logger);
    logger = _logger;
    Logging.info(`Successfully switched from ${oldLoggerName} logger.`);
}

// Expose components.
export const Logging: ILogger & { setLogger: typeof setLogger; } = {
    debug: (...args: any[]) => logger.debug(...args),
    error: (...args: any[]) => logger.error(...args),
    fatal: (...args: any[]) => logger.fatal(...args),
    info: (...args: any[]) => logger.info(...args),
    log: (...args: any[]) => logger.log(...args),
    setLogger,
    trace: (...args: any[]) => logger.trace(...args),
    warn: (...args: any[]) => logger.warn(...args),
};
