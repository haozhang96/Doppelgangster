// Import internal components.
import { IllegalStateError } from "@/common/errors";
import { Optional, Promisable } from "@/common/types";
import { Component } from "@/core/base/components";
import { PersistenceController } from "@/core/base/controllers";
import { Entity, EntityClass } from "@/core/base/persistence/entity";

/**
 * TODO
 */
export abstract class Repository<
    BaseEntityT extends Entity<any, any, any>,
    PersistenceControllerT extends PersistenceController,
    BasePrimaryKeyT
> extends Component {
    protected abstract readonly entityClass: /* BaseEntityClassT */ unknown;
    protected readonly entities:
        Map</* BasePrimaryKeyT */ unknown, Entity<any, any, any>> = new Map();

    constructor(public readonly persistenceController: PersistenceControllerT) {
        super(persistenceController.doppelgangster);

        persistenceController.doppelgangster.logger.info(
            `Instantiating the ${this.constructor.name} repository...`,
            `(persistence controller: ${persistenceController})`,
        );
    }

    public findByPrimaryKey<
        EntityT extends BaseEntityT,
        PrimaryKeyT extends BasePrimaryKeyT
    >(primaryKey: PrimaryKeyT): Optional<EntityT> {
        return this.entities.get(primaryKey) as Optional<EntityT>;
    }

    public fromJSON<EntityT extends BaseEntityT>(serialized: string): EntityT {
        if (!(this.entityClass instanceof Function)) {
            throw new IllegalStateError(
                "The \"entityClass\" field is not a constructor!",
            );
        }

        return (this.entityClass as EntityClass<any, any>).fromJSON(
            this,
            serialized,
        );
    }

    public abstract async create<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<EntityT>;

    public abstract async delete<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
        ...args: any[]
    ): Promise<void>;

    public abstract async find<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<Optional<EntityT>>;

    public abstract async findAll<EntityT extends BaseEntityT>(
        ...args: any[]
    ): Promise<EntityT[]>;

    public abstract async read<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
        ...args: any[]
    ): Promise<EntityT>;

    public abstract async save<EntityT extends BaseEntityT>(
        entity: Promisable<EntityT>,
        ...args: any[]
    ): Promise<EntityT>;
}

/**
 * Define the Repository class' type with the abstract property removed.
 */
export type RepositoryClass<
    RepositoryT extends Repository<any, any, any>,
    PersistenceControllerT extends PersistenceController
> = typeof Repository & (
    new (persistenceController: PersistenceControllerT) => RepositoryT
);
