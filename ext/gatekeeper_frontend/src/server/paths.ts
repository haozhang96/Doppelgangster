// Import built-in libraries.
import * as Path from "path";

// Construct the absolute path to the /dist directory (during runtime).
export const rootDirectory: string = Path.resolve(__dirname, "..");

// Construct the absolute path to the /dist/server directory (during runtime).
export const serverRootDirectory: string =
    Path.resolve(rootDirectory, "server");

// Construct the absolute path to the /dist/client directory (during runtime).
export const clientRootDirectory: string =
    Path.resolve(rootDirectory, "client");

// Construct the absolute path to the /src/client directory (for files other
//   than compiled TypeScripts).
export const clientUncompiledRootDirectory: string =
    Path.resolve(rootDirectory, "..", "src", "client");
