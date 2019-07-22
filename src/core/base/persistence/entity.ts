// Import internal components.
import { IllegalStateError } from "@/common/errors";
import { ISerializable } from "@/common/interfaces/traits";
import { Component } from "@/core/base/components";
import {
    Repository, RepositoryClass,
} from "@/core/base/persistence/repository";
import { PersistenceControllerClass } from '../controllers/persistence_controller';
// import { ReflectionUtils } from "@/utilities";

/**
 * TODO: Change to Repository instead of PersistenceController
 */
export abstract class Entity<
    EntityClassT extends EntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT,
        SerializedT
    >,
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        any,
        EntityClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol),
    SerializedT
> extends Component implements ISerializable<SerializedT> {
    /**
     * Deserialize and construct an instance of Entity from a JSON-encoded
     *   string.
     * @param repository The repository to bind the entity to
     * @param serialized The JSON-encoded string to deserialize from
     */
    public static fromJSON<
        EntityClassT extends EntityClass<
            EntityClassT,
            RepositoryClassT,
            any,
            any
        >,
        RepositoryClassT extends RepositoryClass<RepositoryClassT, any, EntityClassT, any>
    >(
        repository: InstanceType<RepositoryClassT>,
        serialized: string,
    ): InstanceType<EntityClassT> {
        /*return ReflectionUtils.constructInstanceFromJSON(
            this as EntityClass<T>,
            serialized,
            repository,
        ) as T;*/
        /*return Object.assign(
            new (this as EntityClass<T>)(repository),
            JSON.parse(serialized || "{}"),
        );*/
        return Object.assign(
            Object.create(this.prototype),
            JSON.parse(serialized || "{}"),
            { repository },
        );
    }

    public abstract readonly primaryKey:
        EntityPrimaryKey<Entity<any, any, any, any>, any>;
    public readonly properties: string[] = Object.getOwnPropertyNames(this);

    private _destroyed: boolean = false;

    /**
     * Construct an Entity instance.
     * @param repository The Repository instance to attach to
     */
    constructor(public readonly repository: InstanceType<RepositoryClassT>) {
        super(repository.doppelgangster);
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public async delete(...args: any[]): Promise<void> {
        this.assertUsable();
        await this.repository.delete(
            this as InstanceType<EntityClassT>,
            ...args,
        );
        await this.destroy();
    }

    public destroy(): void {
        this.assertUsable();
        this._destroyed = true;
    }

    public async save(...args: any[]): Promise<void> {
        this.assertUsable();
        await this.repository.save(
            this as InstanceType<EntityClassT>,
            ...args,
        );
    }

    public toJSON(): string {
        return JSON.stringify(this);
    }

    public abstract serialize(...args: any[]): SerializedT;

    /**
     * Assert that the entity has not been destroyed.
     */
    private assertUsable(): void {
        if (this._destroyed) {
            throw new IllegalStateError("This entity has been destroyed!");
        }
    }
}

/**
 * Define the Entity class' type with the abstract property removed.
 */
export type EntityClass<
    EntityClassT extends EntityClass<
        EntityClassT,
        RepositoryClassT,
        PrimaryKeyT,
        SerializedT
    >,
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        any,
        EntityClassT,
        PrimaryKeyT
    >,
    PrimaryKeyT extends (string | number | symbol),
    SerializedT
> =
    typeof Entity & (
        new (
            repository: InstanceType<RepositoryClassT>,
        ) => InstanceType<EntityClassT>
    );

/**
 * TODO
 */
export type EntityPrimaryKey<
    BaseEntityT extends Entity<any, any, any, any>,
    EntityT extends BaseEntityT,
> = Exclude<keyof EntityT, keyof BaseEntityT>;
