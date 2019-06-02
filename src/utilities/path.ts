// Import built-in libraries.
import * as $Path from "path";

function getProjectRoot(): string {
    return $Path.resolve(__dirname, "..", "..");
}

/**
 * Resolve an absolute path relative to the source root (/src/).
 */
function sourceRootResolve(...pathSegments: string[]): string {
    return $Path.resolve(getProjectRoot(), "src", ...pathSegments);
}

// Expose components.
export const PathUtils = {
    getProjectRoot,
    sourceRootResolve,
};
