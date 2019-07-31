// Import internal components.
import { NotImplementedError } from "@/common/errors";
import { Entity, EntityPrimaryKey } from "@/core/base/persistence";
import { TypeORMRepository } from "@/persistence/typeorm/typeorm_repository";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export abstract class TypeORMEntity<
    EntityT extends TypeORMEntity<any, any, any>,
    RepositoryT extends TypeORMRepository<any, any>,
    SerializedT
> extends Entity<EntityT, RepositoryT, SerializedT> {
    constructor(
        repository: RepositoryT,
        public readonly typeormEntity: $TypeORM.BaseEntity,
    ) {
        super(repository);
    }

    public serialize(): SerializedT {
        throw new NotImplementedError(
            "serialize() is currently not implemented in TypeORMEntity!",
        );
    }
}

/**
 * Define the TypeORMEntity class' type with the abstract property removed.
 */
export type TypeORMEntityClass<
    EntityT extends TypeORMEntity<any, any, any>,
    RepositoryT extends TypeORMRepository<any, any>
> = typeof TypeORMEntity & (
    new (repository: RepositoryT, typeormEntity: $TypeORM.BaseEntity) => EntityT
);

export type TypeORMEntityPrimaryKey<
    EntityT extends TypeORMEntity<any, any, any>
> = EntityPrimaryKey<TypeORMEntity<any, any, any>, EntityT>;
