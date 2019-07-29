// Import internal components.
import { IllegalStateError } from "@/common/errors";
import { ISerializable } from "@/common/interfaces/traits";
import { Component } from "@/core/base/components";
import { Repository } from "@/core/base/persistence/repository";
// import { ReflectionUtils } from "@/utilities";

/**
 * TODO: Change to Repository instead of PersistenceController
 */
export abstract class Entity<
    EntityT extends Entity<any, any, any>,
    RepositoryT extends Repository<any, any, any>,
    SerializedT
> extends Component implements ISerializable<SerializedT> {
    /**
     * Deserialize and construct an instance of Entity from a JSON-encoded
     *   string.
     * @param repository The repository to bind the entity to
     * @param serialized The JSON-encoded string to deserialize from
     */
    public static fromJSON<EntityT extends Entity<any, any, any>>(
        repository: Repository<any, any, any>,
        serialized: string,
    ): EntityT {
        return Object.assign(
            Object.create(this.prototype),
            JSON.parse(serialized || "{}"),
            { repository },
        );
    }

    public abstract readonly primaryKey:
        EntityPrimaryKey<Entity<EntityT, RepositoryT, SerializedT>, EntityT>;
    public readonly properties: string[] = Object.getOwnPropertyNames(this);

    private _destroyed: boolean = false;

    /**
     * Construct an Entity instance.
     * @param repository The Repository instance to attach to
     */
    constructor(public readonly repository: RepositoryT) {
        super(repository.doppelgangster);
    }

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public async delete(...args: any[]): Promise<void> {
        this.assertUsable();
        await this.repository.delete(this as unknown as EntityT, ...args);
        await this.destroy();
    }

    public destroy(): void {
        this.assertUsable();
        this._destroyed = true;
    }

    public async save(...args: any[]): Promise<void> {
        this.assertUsable();
        await this.repository.save(this as unknown as EntityT, ...args);
    }

    public toJSON(): string {
        return JSON.stringify(this);
    }

    public abstract serialize(...args: any[]): SerializedT;

    /**
     * Assert that the entity has not been destroyed.
     */
    private assertUsable(): void {
        if (this.repository === undefined) {
            throw new IllegalStateError("This entity has no repository!");
        } else if (this._destroyed) {
            throw new IllegalStateError("This entity has been destroyed!");
        }
    }
}

/**
 * Define the Entity class' type with the abstract property removed.
 */
export type EntityClass<
    EntityT extends Entity<any, any, any>,
    RepositoryT extends Repository<any, any, any>
> = typeof Entity & (new (repository: RepositoryT) => EntityT);

/**
 * TODO
 */
export type EntityPrimaryKey<
    BaseEntityT extends Entity<any, any, any>,
    EntityT extends BaseEntityT,
> = Exclude<keyof EntityT, keyof BaseEntityT>;