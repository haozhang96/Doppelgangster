// Import built-in libraries.
import * as Path from "path";

// Construct the absolute path to the /src directory.
export const rootDirectory: string = Path.resolve(__dirname, "..");

// Construct the absolute path to the /src/server directory.
export const serverRootDirectory: string =
    Path.resolve(rootDirectory, "server");

// Construct the absolute path to the /src/client directory.
export const clientRootDirectory: string =
    Path.resolve(rootDirectory, "client");
