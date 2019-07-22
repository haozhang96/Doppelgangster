// Import internal components.
import { Entity, EntityPrimaryKey } from "@/core/base/persistence";
import {
   TypeORMRepositoryClass, TypeORMRepository, TypeORMRepository,
} from "@/persistence/typeorm/typeorm_repository";

// Import external libraries.
import * as $TypeORM from "typeorm";
import { TypeORMPersistenceController } from '@/controllers/persistence';
import { doppelgangster } from '@/app';

/**
 * TODO
 */
export abstract class TypeORMEntity<
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> extends Entity<EntityClassT, RepositoryClassT, PrimaryKeyT, string> {
    protected abstract readonly _entity: $TypeORM.BaseEntity;

    constructor(repository: InstanceType<RepositoryClassT>) {
        super(repository);
    }
}

/**
 * Define the TypeORMEntity class' type with the abstract property removed.
 */
export type TypeORMEntityClass<
    EntityClassT extends TypeORMEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    RepositoryClassT extends TypeORMRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> =
    typeof TypeORMEntity & (
        new (
            repository: InstanceType<RepositoryClassT>,
        ) => InstanceType<EntityClassT>
    );

export type TypeORMEntityPrimaryKey<
    EntityT extends TypeORMEntity<any, any, any>
> = EntityPrimaryKey<TypeORMEntity<any, any, any>, EntityT>;

// Testing
// tslint:disable: max-classes-per-file
class MyRepository extends TypeORMRepository<
    typeof MyRepository,
    typeof MyEntity,
    string
> {

}

class MyEntity extends TypeORMEntity<
    typeof MyEntity,
    typeof MyRepository,
    string
> {
    public readonly primaryKey: TypeORMEntityPrimaryKey<MyEntity> = "b";

    public a: string = "hi";
    public b: string = "";
}

/*type MyRepositoryClass<
    RepositoryClassT extends MyRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    EntityClassT extends MyEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> =
    typeof MyRepository;

type MyEntityClass<
    EntityClassT extends MyEntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT
    >,
    RepositoryClassT extends MyRepositoryClass<
        RepositoryClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol)
> =
    typeof MyEntity;*/

MyEntity.fromJSON<MyEntityClass<MyEntityClass, MyRepositoryClass, string>, typeof MyRepository>(
    new MyRepository(new TypeORMPersistenceController(doppelgangster)),
    "",
);
