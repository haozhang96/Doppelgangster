// Import internal components.
import { Callback, Optional } from "@/common/types";

// Import built-in libraries.
import * as $Utilities from "util";

/**
 * Stringify an error object.
 * @param error The error object to stringify
 * @param extended Whether to include extended error information
 */
export function stringifyError(
    error?: Error,
    extended: boolean = true,
): string {
    // If no error object was given, then the reason is not known.
    if (!error) {
        return "Error: Unknown reason";
    }

    // TODO:
    if (extended) {
        return error.stack || $Utilities.inspect(error);
    } else {
        return error.toString();
    }
}

/**
 * Use a poll to wait until a condition callback returns true to return a value
 *   retrieved from a result callback.
 * @param condition A callback to call to check for a truthy condition
 * @param result A callback to call to retrieve the result to return once the
 *   condition becomes true
 * @param pollingInterval The condition-checking interval
 * @param timeout The amount of time in milliseconds before returning undefined
 */
export async function waitUntil<ReturnT>(
    condition: Callback<any, any>,
    result: Callback<any, ReturnT>,
    pollingInterval: number = 5,
    timeout: number = Infinity,
): Promise<Optional<ReturnT>> {
    if (condition()) {
        return result();
    }

    const started: number = Date.now();
    return await new Promise((resolve) => {
        const poll = setInterval(() => {
            const timedOut: boolean = Date.now() - started > timeout;
            if (condition() || timedOut) {
                clearInterval(poll);
                resolve(timedOut ? undefined : result());
            }
        }, pollingInterval);
    });
}

// Expose components.
export const MiscUtils = {
    stringifyError,
    waitUntil,
};
