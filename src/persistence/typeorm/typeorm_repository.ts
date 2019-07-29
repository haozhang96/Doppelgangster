// Import internal components.
import { Optional } from "@/common/types";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import { Repository } from "@/core/base/persistence";
import { TypeORMEntityClass } from "@/persistence/typeorm/typeorm_entity";

// Import external libraries.
// import * as $TypeORM from "typeorm";

/**
 * TODO
 */
export abstract class TypeORMRepository<
    BaseEntityClassT extends TypeORMEntityClass<any, any>,
    BasePrimaryKeyT
> extends Repository<
    BaseEntityClassT,
    TypeORMPersistenceController,
    BasePrimaryKeyT
> {
    public async create<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<InstanceType<EntityClassT>> {
        return new Entity(this) as InstanceType<EntityClassT>;
    }

    public async delete<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void> {
        return;
    }

    public async destroy(): Promise<void> {
        return;
    }

    public async find<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<Optional<InstanceType<EntityClassT>>> {
        return this.create(Entity, ...args);
    }

    public async findAll<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<Array<InstanceType<EntityClassT>>> {
        return [await this.create(Entity, ...args)];
    }

    public async read<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
    ): Promise<void> {
        return;
    }

    public async save<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
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
