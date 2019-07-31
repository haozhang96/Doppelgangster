// Import internal components.
import { IInitializable } from "@/common/interfaces/traits";
import { Promisable } from "@/common/types";
import { Doppelgangster } from "@/core";
import {
    ControllerClass, PersistenceController,
} from "@/core/base/controllers";
import {
    TypeORMRepositoryClass,
} from "@/persistence/typeorm/typeorm_repository";
import * as Utilities from "@/utilities";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export class TypeORMPersistenceController
        extends PersistenceController implements IInitializable {
    private _database!: $TypeORM.EntityManager;

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Connecting to the database...");
        $TypeORM.getConnectionOptions().then(async (options) =>
            // Merge user-provided connection options with the static options.
            await $TypeORM.createConnection({
                ...options,
                ...{
                    entities: ["dist/src/core/persistence/entities/*.js"],
                },
            }),
        ).then((_database) => {
            this._database = _database.manager;
            doppelgangster.logger.info("The database is ready.");
        }).catch((error) => {
            doppelgangster.logger.error(
                "An error has occurred while connecting to the database:",
                error,
            );
        });
    }

    public get initialized(): boolean {
        return !!this._database;
    }

    public async destroy(): Promise<void> {
        await super.destroy();
        await this._database.connection.close();
    }

    public async getRepository<
        RepositoryClassT extends TypeORMRepositoryClass<any>
    >(
        Repository: Promisable<RepositoryClassT>,
    ): Promise<InstanceType<RepositoryClassT>> {
        await this.initialize();
        return super.getRepository(await Repository);
    }

    public async initialize(): Promise<this> {
        return Utilities.misc.waitUntil(
            () => this._database,
            () => this,
        ) as unknown as this;
    }
}

/**
 * Define the TypeORMPersistenceController class' type with the abstract
 *   property removed.
 */
export type TypeORMPersistenceControllerClass = ControllerClass<
    typeof TypeORMPersistenceController,
    TypeORMPersistenceController
>;
