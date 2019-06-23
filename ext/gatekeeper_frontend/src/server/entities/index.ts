// Import external libraries.
import * as $TypeORM from "typeorm";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

/**
 * Return all the database models in /src/server/models.
 */
export function getModels(): $TypeORM.BaseEntity[] {
    return $FileSystem.readdirSync(__dirname).filter((file) =>
        file.endsWith(".js") && file !== $Path.basename(__filename),
    ).map((file) =>
        require($Path.resolve(__dirname, file)).default,
    );
}
