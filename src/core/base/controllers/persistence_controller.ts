// Import internal components.
import {
    ClassConstructorCallSignatureWithoutFirstArg, Promisable,
} from "@/common/types";
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
        ...args: ClassConstructorCallSignatureWithoutFirstArg<RepositoryClassT>
    ): Promise<InstanceType<RepositoryClassT>> {
        // Ensure that a repository singleton instance is associated with this
        //   persistence controller.
        if (!this.repositories.has(_Repository = await _Repository)) {
            this.repositories.set(
                _Repository,
                new (_Repository as any)(this, ...args),
            );
        }

        // Return the repository singleton instance associated with this
        //   persistence controller.
        return (
            this.repositories.get(_Repository) as InstanceType<RepositoryClassT>
        );
    }

    public abstract async query(query: string, ...args: any[]): Promise<any>;
    public abstract async synchronize(): Promise<void>;
}

/**
 * Define the PersistenceController class' type with the abstract property
 *   removed.
 */
export type PersistenceControllerClass =
    ControllerClass<typeof PersistenceController, PersistenceController>;
