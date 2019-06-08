// Import built-in libraries.
import * as $Path from "path";

export const projectRoot: string = $Path.resolve(__dirname, "..", "..");

/**
 * Resolve an absolute path relative to the source root (/src/).
 */
export function sourceRootResolve(...pathSegments: string[]): string {
    return $Path.resolve(projectRoot, "src", ...pathSegments);
}

// Expose components.
export const PathUtils = {
    projectRoot,
    sourceRootResolve,
};
