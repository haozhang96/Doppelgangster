// Import internal components.
import { Optional, Promisable } from "@/common/types";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import { Repository } from "@/core/base/persistence";
import {
    TypeORMEntity, TypeORMEntityClass,
} from "@/persistence/typeorm/typeorm_entity";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export abstract class TypeORMRepository<
    BaseEntityT extends TypeORMEntity<any, any, any>,
    BasePrimaryKeyT
> extends Repository<
    BaseEntityT,
    TypeORMPersistenceController,
    BasePrimaryKeyT
> {
    public readonly typeormRepository: $TypeORM.Repository<BaseEntityT>;

    constructor(
        persistenceController: TypeORMPersistenceController,
        repositoryName: string,
    ) {
        super(persistenceController);
        this.typeormRepository =
            persistenceController.typeormDatabase.getRepository(repositoryName);
    }

    public async create<EntityT extends BaseEntityT>(
        typeormEntity: $TypeORM.BaseEntity,
    ): Promise<EntityT> {
        return new (this.entityClass as TypeORMEntityClass<any, any>)(
            this,
            typeormEntity,
        ) as EntityT;
    }

    public async delete<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
        ...args: any[]
    ): Promise<void> {
        return;
    }

    public async destroy(): Promise<void> {
        return;
    }

    public async find<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<Optional<EntityT>> {
        return this.create<EntityT>();
    }

    public async findAll<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<EntityT[]> {
        return [await this.create<EntityT>()];
    }

    public async read<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
    ): Promise<EntityT> {
        return entity;
    }

    public async save<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
    ): Promise<EntityT> {
        return entity;
    }
}

/**
 * Define the TypeORMRepository class' type with the abstract property removed.
 */
export type TypeORMRepositoryClass<
    RepositoryT extends TypeORMRepository<any, any>
> = typeof TypeORMRepository & (
    new (persistenceController: TypeORMPersistenceController) => RepositoryT
);
