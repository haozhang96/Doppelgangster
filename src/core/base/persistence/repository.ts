// Import internal components.
import { IllegalStateError } from "@/common/errors";
import { Optional } from "@/common/types";
import { Component } from "@/core/base/components";
import { PersistenceController } from "@/core/base/controllers";
import { Entity, EntityClass } from "@/core/base/persistence/entity";

/**
 * TODO
 */
export abstract class Repository<
    BaseEntityClassT extends EntityClass<any, any>,
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
        EntityClassT extends BaseEntityClassT,
        PrimaryKeyT extends BasePrimaryKeyT
    >(primaryKey: PrimaryKeyT): Optional<InstanceType<EntityClassT>> {
        return this.entities.get(primaryKey) as InstanceType<EntityClassT>;
    }

    public fromJSON<EntityClassT extends BaseEntityClassT>(
        serialized: string,
    ): InstanceType<EntityClassT> {
        if (!(this.entityClass instanceof Function)) {
            throw new IllegalStateError(
                "The \"entityClass\" field is not a constructor!",
            );
        }

        return (this.entityClass as EntityClassT).fromJSON(this, serialized);
    }

    public abstract async create<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<InstanceType<EntityClassT>>;

    public abstract async delete<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;

    public abstract async find<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<Optional<InstanceType<BaseEntityClassT>>>;

    public abstract async findAll<EntityClassT extends BaseEntityClassT>(
        Entity: EntityClassT,
        ...args: any[]
    ): Promise<Array<InstanceType<EntityClassT>>>;

    public abstract async read<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;

    public abstract async save<EntityClassT extends BaseEntityClassT>(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;
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
