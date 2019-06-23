// Import internal components.
import { getModels } from "./entities";

import * as $TypeORM from "typeorm";

$TypeORM.createConnection();

/*// Import external libraries.
import * as $Waterline from "waterline";

// Parse the database configurations from the environment variable.
const configurations = JSON.parse(process.env.DATABASE || "");

// Create a global Waterline instance to be used throughout the server
//   singleton.
// If you see any odd usages of "any" to override typings, this is due to
//   @types/waterline being out-of-date relative to waterline.
const database: $Waterline.Waterline = new $Waterline.default();

// Expose the models that will be populated after initialization.
export let models: { readonly [name: string]: $Waterline.Model; };

// Load and register all the database models defined in /src/server/models.
getModels().forEach((database as any).registerModel);

// Initialize the database using the provided configurations in the environment
//   variables.
database.initialize({
    adapters: { [configurations.adapter]: require(configurations.adapter) },
    datastores: { default: configurations },
} as any, async (error, ontology) => {
    if (error) {
        console.error(
            "An error has occurred while initializing the database:",
            error,
        );
        return;
    }

    // Set a global reference to the retrieved models.
    models = ontology.collections;

    // Testing
    console.log("Models:", models);
    console.log(
        await models.fingerprints.find({ userID: "147458853456314368" }),
    );
    await models.fingerprints.create({ userID: "12345", fingerprints: [] });
    console.log(models.fingerprints);
});*/
