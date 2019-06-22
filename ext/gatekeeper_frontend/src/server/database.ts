// Import internal components.
import { serverRootDirectory } from "./paths";

// Import external libraries.
import * as $Waterline from "waterline";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

// Parse the database configurations from the environment variable.
const configurations = JSON.parse(process.env.DATABASE || "");

// Create and expose a Waterline instance.
// If you see any odd usages of "any" to override typings, this is due to
//   @types/waterline being out-of-date relative to waterline.
export const database: $Waterline.Waterline = new $Waterline.default();

// Expose the models that will be populated after initialization.
export let models: $Waterline.Collection;

// Load all the database models.
getModels().forEach((database as any).registerModel);

/**
 * Return all the database models in /src/server/models.
 */
function getModels(): $Waterline.CollectionClass[] {
    const modelsDirectory: string =
        $Path.resolve(serverRootDirectory, "models");

    return $FileSystem.readdirSync(modelsDirectory).filter((file) =>
        file.endsWith(".js"),
    ).map((file) =>
        require($Path.resolve(modelsDirectory, file)).default,
    );
}

// Initialize the database using the provided configurations in the environment
//   variables.
database.initialize({
    adapters: {
        [configurations.adapter]: require("sails-" + configurations.adapter),
    },

    datastores: {
        default: configurations,
    },
} as any, (error, ontology: any) => {
    if (error) {
        console.error(
            "An error has occurred while initializing the database:",
            error,
        );
        return;
    }

    console.log("Ontology:", ontology);
    models = ontology.collections;
});
