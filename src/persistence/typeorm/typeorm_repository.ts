// Import internal components.
import { TypeORMPersistenceController } from "@/controllers/persistence";
import { Repository } from "@/core/base/persistence";
import { TypeORMEntity } from "@/persistence/typeorm/typeorm_entity";
import { Optional } from '@/common/types';

// Import external libraries.
// import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export abstract class TypeORMRepository<
    BaseEntityT extends TypeORMEntity<any, any, any>,
    PrimaryKeyT
> extends Repository<
    BaseEntityT,
    TypeORMPersistenceController,
    PrimaryKeyT
> {
    public async create<EntityT extends BaseEntityT>(): Promise<EntityT> {
        return this as unknown as EntityT;
    }

    public async delete(): Promise<void> {
        return;
    }

    public async destroy(): Promise<void> {
        return;
    }

    public async find<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<Optional<EntityT>> {
        return this as unknown as EntityT;
    }

    public async findAll<EntityT extends BaseEntityT>(): Promise<EntityT[]> {
        return [this] as unknown as EntityT[];
    }

    public async read<EntityT extends BaseEntityT>(
        entity: EntityT,
    ): Promise<void> {
        return;
    }

    public async save<EntityT extends BaseEntityT>(
        entity: EntityT,
    ): Promise<void> {
        return;
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
