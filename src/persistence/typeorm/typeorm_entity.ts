// Import internal components.
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
    PrimaryKeyT
> extends Entity<EntityT, RepositoryT, PrimaryKeyT> {
    protected abstract readonly typeormEntity: $TypeORM.BaseEntity;
}

/**
 * Define the TypeORMEntity class' type with the abstract property removed.
 */
export type TypeORMEntityClass<
    EntityT extends TypeORMEntity<any, any, any>,
    RepositoryT extends TypeORMRepository<any, any>
> = typeof TypeORMEntity & (
    new (repository: RepositoryT) => EntityT
);

export type TypeORMEntityPrimaryKey<
    EntityT extends TypeORMEntity<any, any, any>
> = EntityPrimaryKey<TypeORMEntity<any, any, any>, EntityT>;
