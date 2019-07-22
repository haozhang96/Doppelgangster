// Import internal components.
import {
    Controller, ControllerClass,
} from "@/core/base/controllers/controller";
import { EntityClass, RepositoryClass } from "@/core/base/persistence"; // TODO

/**
 * TODO
 */
export abstract class PersistenceController<
    PersistenceControllerClassT extends PersistenceControllerClass<
        PersistenceControllerClassT,
        RepositoryClassT,
        EntityClassT
    >,
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        PersistenceControllerClassT,
        EntityClassT,
        any
    >,
    EntityClassT extends EntityClass<EntityClassT, RepositoryClassT, any, any>
> extends Controller {
    protected readonly repositories:
        Map<RepositoryClassT, InstanceType<RepositoryClassT>> = new Map();

    public async getRepository(
        Repository: RepositoryClassT,
    ): Promise<InstanceType<RepositoryClassT>> {
        // Ensure that a repository singleton instance is associated with this
        //   persistence controller.
        if (!this.repositories.has(Repository)) {
            this.repositories.set(
                Repository,
                new Repository(this) as InstanceType<RepositoryClassT>,
            );
        }

        // Return the repository singleton instance associated with this
        //   persistence controller.
        return (
            this.repositories.get(Repository) as InstanceType<RepositoryClassT>
        );
    }
}

/**
 * Define the PersistenceController class' type with the abstract property
 *   removed.
 */
export type PersistenceControllerClass<
    PersistenceControllerClassT extends PersistenceControllerClass<
        PersistenceControllerClassT,
        RepositoryClassT,
        EntityClassT
    >,
    RepositoryClassT extends RepositoryClass<
        RepositoryClassT,
        PersistenceControllerClassT,
        EntityClassT,
        any
    >,
    EntityClassT extends EntityClass<EntityClassT, RepositoryClassT, any, any>
> =
    ControllerClass<
        typeof PersistenceController,
        PersistenceController<
            PersistenceControllerClassT,
            RepositoryClassT,
            EntityClassT
        >
    >;
