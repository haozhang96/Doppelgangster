// Import built-in libraries.
import * as $Utilities from "util";

/**
 * Stringify an error object.
 * @param error The error object to stringify
 * @param extended Whether to include extended error information
 */
function stringifyError(
    error: Error | undefined,
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

// Expose components.
export const Miscellaneous = {
    stringifyError,
};
