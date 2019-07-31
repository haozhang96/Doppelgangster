// Import internal components.
import { Promisable } from "@/common/types";
import {
    Controller, ControllerClass,
} from "@/core/base/controllers/controller";
import { Repository, RepositoryClass } from "@/core/base/persistence";

/**
 * The PersistenceController class defines a base class for persistence
 *   controllers to build upon.
 */
export abstract class PersistenceController extends Controller {
    protected readonly repositories:
        Map<RepositoryClass<any, any>, Repository<any, any, any>> = new Map();

    public async destroy(): Promise<void> {
        // Destroy all the active repositories.
        for (const repository of this.repositories.values()) {
            await repository.destroy();
        }
    }

    public async getRepository<
        RepositoryClassT extends RepositoryClass<any, any>
    >(
        _Repository: Promisable<RepositoryClassT>,
    ): Promise<InstanceType<RepositoryClassT>> {
        _Repository = await _Repository;

        // Ensure that a repository singleton instance is associated with this
        //   persistence controller.
        if (!this.repositories.has(_Repository)) {
            this.repositories.set(_Repository, new _Repository(this));
        }

        // Return the repository singleton instance associated with this
        //   persistence controller.
        return (
            this.repositories.get(_Repository) as InstanceType<RepositoryClassT>
        );
    }
}

/**
 * Define the PersistenceController class' type with the abstract property
 *   removed.
 */
export type PersistenceControllerClass =
    ControllerClass<typeof PersistenceController, PersistenceController>;
