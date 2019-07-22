// Import internal components.
import {
    TypeORMPersistenceController, TypeORMPersistenceControllerClass,
} from "@/controllers/persistence";
import { Repository } from "@/core/base/persistence";
import { TypeORMEntityClass } from "@/persistence/typeorm/typeorm_entity";

// Import external libraries.
// import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export abstract class TypeORMRepository<
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> extends Repository<
    RepositoryClassT,
    TypeORMPersistenceControllerClass<RepositoryClassT, EntityClassT>,
    EntityClassT,
    PrimaryKeyT
> {
    constructor(
        persistenceController:
            TypeORMPersistenceController<RepositoryClassT, EntityClassT>,
    ) {
        super(persistenceController);
    }
}

/**
 * Define the TypeORMRepository class' type with the abstract property removed.
 */
export type TypeORMRepositoryClass<
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> = typeof TypeORMRepository & (
    new (
        persistenceController:
            TypeORMPersistenceController<RepositoryClassT, EntityClassT>,
    ) => InstanceType<RepositoryClassT>
);
