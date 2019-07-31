// Import internal components.
import { ExtendedSet } from "@/common/classes/extended_set";
import { IllegalStateError } from "@/common/errors";
import { ISerializable } from "@/common/interfaces/traits";
import { Component } from "@/core/base/components";
import { Repository } from "@/core/base/persistence/repository";

/**
 * TODO
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
        repository: Repository<EntityT, any, any>,
        serialized: string,
    ): EntityT {
        // Deserialize the JSON string. Any errors in the serialized string will
        //   cause a SyntaxError.
        const deserialized: any = JSON.parse(serialized || "{}");

        // Use a dummy instance to populate the properties that are set in the
        //   constructor - which are all the class-level field declarations set
        //   in TypeScript.
        if (!this.properties) {
            this.properties = new ExtendedSet(Object.getOwnPropertyNames(
                (this as any).call(null, repository),
            ));
        }

        // Determine the property intersection and union sizes.
        const deserializedProperties: string[] = Object.keys(deserialized);
        const intersectedPropertyCount: number =
            this.properties.intersect(deserializedProperties).size;
        const unionedPropertyCount: number =
            this.properties.union(deserializedProperties).size;
        const expectedPropertyCount: number = this.properties.size;

        // Make sure that the deserialized object contains the expected keys.
        if (intersectedPropertyCount < expectedPropertyCount) {
            throw new TypeError(
                "Not enough properties were given in the serialized string!",
            );
        } else if (unionedPropertyCount > expectedPropertyCount) {
            throw new TypeError(
                "Too many properties were given in the serialized string!",
            );
        }

        // Create an entity instance with the given deserialized properties.
        return Object.assign(
            Object.create(this.prototype),
            deserialized,
            { repository },
        );
    }

    // Keep a set of properties for checking against deserialized JSON objects.
    private static properties: ExtendedSet<string>;

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
        await this.repository.delete(this, ...args);
        await this.destroy();
    }

    public destroy(): void {
        this.assertUsable();
        this._destroyed = true;
    }

    public async load(...args: any[]): Promise<this> {
        this.assertUsable();
        return this.repository.read(this, ...args);
    }

    public async save(...args: any[]): Promise<this> {
        this.assertUsable();
        return this.repository.save(this, ...args);
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
        } else if (this.repository === undefined) {
            throw new IllegalStateError("This entity has no repository!");
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
