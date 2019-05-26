import { doppelgangster } from "@/app"; // Circular import?
import { LoggingController } from "@/core/base/controllers";

// Wait for a logging controller to exist in the global Doppelgangster instance.
const started: number = Date.now();
const checker = setInterval(() => {
    // Find a new logging controller.
    const controller =
        Object.values(doppelgangster.controllers).find((_controller) =>
            _controller instanceof LoggingController,
        );

    if (controller) {
        // Switch to the new logging controller.
        clearInterval(checker);
        const oldControllerName: string =
            Logging.constructor ? Logging.constructor.name : "" + Logging;
        Logging.info(`Switching to the ${controller.constructor.name} logger.`);
        Logging = controller as LoggingController;
        Logging.info(`Switched from the ${oldControllerName} logger.`);
    } else if (Date.now() - started >= 15000) {
        // If no new logging controler was found after 15 seconds, assume there
        //   won't ever be one.
        clearInterval(checker);
    }
}, 500);

// Define a basic console logger as the default logger.
// tslint:disable:no-console
export let Logging = {
    debug: console.debug,
    error: console.error,
    fatal: (...args: any[]) => console.error("[!!! FATAL !!!]", ...args),
    info: console.info,
    log: console.log,
    trace: console.trace,
    warn: console.warn,
};
// tslint:enable:no-console

// Expose components.
/*export const Logging = {
    debug: (...args: any[]) => Logger.debug(...args),
    error: (...args: any[]) => Logger.error(...args),
    fatal: (...args: any[]) => Logger.fatal(...args),
    info: (...args: any[]) => Logger.info(...args),
    log: (...args: any[]) => Logger.log(...args),
    trace: (...args: any[]) => Logger.trace(...args),
    warn: (...args: any[]) => Logger.warn(...args),
};*/