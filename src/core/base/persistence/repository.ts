// Import internal components.
import { Optional } from "@/common/types";
import { Component } from "@/core/base/components";
import { PersistenceControllerClass } from "@/core/base/controllers";
import { EntityClass } from "@/core/base/persistence/entity";

/**
 * TODO
 */
export abstract class Repository<
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        PersistenceControllerClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    PersistenceControllerClassT extends PersistenceControllerClass<
        PersistenceControllerClassT,
        RepositoryClassT,
        EntityClassT
    >,
    EntityClassT extends EntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT,
        any
    >,
    PrimaryKeyT extends (string | number | symbol)
> extends Component {
    protected readonly entities:
        Map<PrimaryKeyT, InstanceType<EntityClassT>> = new Map();

    // @Override
    protected abstract readonly entityClass: EntityClassT;

    constructor(
        public readonly persistenceController:
            InstanceType<PersistenceControllerClassT>,
    ) {
        super(persistenceController.doppelgangster);

        persistenceController.doppelgangster.logger.info(
            `Instantiating the ${this.constructor.name} repository...`,
            `(persistence controller: ${persistenceController})`,
        );
    }

    public findByPrimaryKey(
        primaryKey: PrimaryKeyT,
    ): Optional<InstanceType<EntityClassT>> {
        return this.entities.get(primaryKey);
    }

    /**
     * Deserialize and construct an instance of Entity from a JSON-encoded
     *   string.
     * @param Entity The Entity class to construct an instance of
     * @param serialized The JSON-encoded string to deserialize from
     */
    public fromJSON(serialized: string): InstanceType<EntityClassT> {
        return this.entityClass.fromJSON(this, serialized);
    }

    public abstract async create(
        ...args: any[]
    ): Promise<InstanceType<EntityClassT>>;

    public abstract async delete(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;

    public abstract async find(
        ...args: any[]
    ): Promise<Optional<InstanceType<EntityClassT>>>;

    public abstract async findAll(
        ...args: any[]
    ): Promise<Array<InstanceType<EntityClassT>>>;

    public abstract async read(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;

    public abstract async save(
        entity: InstanceType<EntityClassT>,
        ...args: any[]
    ): Promise<void>;
}

/**
 * Define the Repository class' type with the abstract property removed.
 */
export type RepositoryClass<
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        PersistenceControllerClassT,
        EntityClassT,
        PrimaryKeyT
    >,
    PersistenceControllerClassT extends PersistenceControllerClass<
        PersistenceControllerClassT,
        RepositoryClassT,
        EntityClassT
    >,
    EntityClassT extends EntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT,
        any
    >,
    PrimaryKeyT extends (string | number | symbol)
> = typeof Repository & (
    new (persistenceController: InstanceType<PersistenceControllerClassT>) =>
        InstanceType<RepositoryClassT>
);
