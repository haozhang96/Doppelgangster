// Import external libraries.
import * as $TypeORM from "typeorm";

// Expose a reference to the database. Note that it might not be ready at first
//   since this is returned asynchronously, but it should be fine since the
//   first usage of the database (i.e. when a user connects to the front-end)
//   will most likely take longer than the initialization time.
export let database: $TypeORM.EntityManager;

// Connect to the database and set the global reference.
console.log("Connecting to the database...");
$TypeORM.getConnectionOptions().then(async (options) =>
    // Merge default connection options with user-provided options.
    await $TypeORM.createConnection({
        ...options, // This must be up top or it will overwrite entities.
        ...{
            entities: ["dist/server/entities/*.js"],
        },
    }),
).then((_database) => {
    database = _database.manager;
    console.log("The database is ready.");
}).catch((error) => {
    console.error(
        "An error has occurred while connecting to the database:",
        error,
    );
});
