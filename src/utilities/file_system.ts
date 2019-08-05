// Import internal components.
import { Logging } from "@/utilities/logging";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

export function getAllFilePaths(root: string): string[] {
    if (!$FileSystem.existsSync(root)) {
        Logging.warn(`"${root}" does not exist! Returning an empty array.`);
        return [];
    }

    return $FileSystem.readdirSync(root).map((file) =>
        $Path.resolve(root, file),
    ).map((file) =>
        $FileSystem.statSync(file).isDirectory() ? getAllFilePaths(file) : file,
    ).flat();
}

// Expose components.
export const FileSystemUtils = {
    getAllFilePaths,
};
