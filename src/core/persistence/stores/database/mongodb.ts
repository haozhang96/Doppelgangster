import { DataStore } from "@/core/persistence/data_store";
import * as Utilities from "@/utilities";

import * as $MongoDB from "@/core/persistence/stores/databases/node_modules/mongodb";

export class MongoDBDataStore extends DataStore {
    private readonly _database: $MongoDB.Db;

    constructor(connectionUrl: string, databaseName: string) {
        super();
        Utilities.logging.info(`Connecting to MongoDB database "${
            databaseName
        }" @ ${
            connectionUrl
        }...`);
        this._database = new $MongoDB.MongoClient(
            connectionUrl,
            {
                reconnectInterval: 5000,
                reconnectTries: Number.MAX_VALUE,
                useNewUrlParser: true,
            },
        ).db(databaseName);
        Utilities.logging.info("Successfully connected to database.");
    }

    // Override methods
}
