// Import internal components.
import { IllegalArgumentError } from "@/common/errors";
import { IInitializable } from "@/common/interfaces/traits";
import { CallbackCallSignature, Optional, Promisable } from "@/common/types";
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
> implements IInitializable {
    public abstract readonly repositoryName: string;
    public typeormRepository!:
        $TypeORM.Repository<TypeORMEntity<any, any, any>>;

    public get initialized(): boolean {
        return !!this.typeormRepository;
    }

    public async create<EntityT extends BaseEntityT>(): Promise<EntityT> {
        await this.initialize();
        return new (this.entityClass as TypeORMEntityClass<any, any>)(
            this,
        ) as EntityT;
    }

    public async delete<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
        ...args:
            CallbackCallSignature<typeof $TypeORM.Repository.prototype.delete>
    ): Promise<void> {
        await this.initialize();
        if (await entity) {
            await this.typeormRepository.delete(...args);
        }
    }

    public async destroy(): Promise<void> {
        return;
    }

    public async find<EntityT extends BaseEntityT>(
        ...args:
            CallbackCallSignature<typeof $TypeORM.Repository.prototype.findOne>
    ): Promise<Optional<EntityT>> {
        await this.initialize();
        return (
            await this.typeormRepository.findOne(...args) as Optional<EntityT>
        );
    }

    public async findAll<EntityT extends BaseEntityT>(
        ...args:
            CallbackCallSignature<typeof $TypeORM.Repository.prototype.find>
    ): Promise<EntityT[]> {
        await this.initialize();
        return await this.typeormRepository.find(...args) as EntityT[];
    }

    public async initialize(): Promise<this> {
        // Create the TypeORM repository instance if it doesn't already exist.
        if (!this.typeormRepository) {
            this.typeormRepository =
                this.persistenceController.typeormDatabase.getRepository(
                    this.repositoryName,
                );
        }

        return this;
    }

    public async read<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
    ): Promise<EntityT> {
        await this.initialize();
        return entity;
    }

    public async save<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
    ): Promise<EntityT> {
        await this.initialize();

        const existingEntity: Optional<TypeORMEntity<any, any, any>> =
            this.entities.get((entity = await entity).primaryKey);
        if (existingEntity && existingEntity !== entity) {
            throw new IllegalArgumentError(
                "The provided entity has a conflicting primary key with the "
                + `existing entity in the repository (${
                    String(entity.primaryKey)
                })!`,
            );
        }

        // TODO: Save to TypeORM repository

        return entity;
    }

    public async synchronize(): Promise<void> {
        await this.initialize();
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
