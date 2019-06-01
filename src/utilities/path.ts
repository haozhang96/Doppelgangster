// Import built-in libraries.
import * as $Path from "path";

/**
 * Resolve an absolute path relative to the source root (/src/).
 */
function sourceRootResolve(...pathSegments: string[]): string {
    return $Path.resolve(__dirname, "..", ...pathSegments);
}

// Expose components.
export const PathUtils = {
    sourceRootResolve,
};
