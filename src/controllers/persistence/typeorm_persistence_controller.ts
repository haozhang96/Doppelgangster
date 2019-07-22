// Import internal components.
import { IInitializable } from "@/common/interfaces/traits";
import { Doppelgangster } from "@/core";
import {
    ControllerClass, PersistenceController,
} from "@/core/base/controllers";
import { TypeORMEntityClass } from "@/persistence/typeorm/typeorm_entity";
import {
    TypeORMRepositoryClass,
} from "@/persistence/typeorm/typeorm_repository";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export class TypeORMPersistenceController<
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        any
    >,
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        any
    >
> extends PersistenceController<
    TypeORMPersistenceControllerClass<RepositoryClassT, EntityClassT>,
    RepositoryClassT,
    EntityClassT
> implements IInitializable {
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
        return;
    }

    public async getRepository(
        Repository: RepositoryClassT,
    ): Promise<InstanceType<RepositoryClassT>> {
        await this.initialize();
        return super.getRepository(Repository);
    }

    public async initialize(): Promise<this> {
        if (!this._database) {
            return await new Promise((resolve) => {
                const poll = setInterval(() => {
                    if (this._database) {
                        clearInterval(poll);
                        resolve(this);
                    }
                }, 5);
            });
        }

        return this;
    }
}

/**
 * Define the TypeORMPersistenceController class' type with the abstract
 *   property removed.
 */
export type TypeORMPersistenceControllerClass<
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        any
    >,
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        any
    >
> =
    ControllerClass<
        typeof TypeORMPersistenceController,
        TypeORMPersistenceController<RepositoryClassT, EntityClassT>
    >;
