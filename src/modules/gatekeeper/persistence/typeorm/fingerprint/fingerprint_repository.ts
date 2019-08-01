// Import internal components.
import { Promisable } from "@/common/types";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import { Profile } from "@/core/heuristic/profile";
import { IFingerprint } from "@/modules/gatekeeper/interfaces";
import {
    IFingerprintRepository,
} from "@/modules/gatekeeper/persistence/base/fingerprint";
import {
    FingerprintEntity,
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint";
import { TypeORMRepository } from "@/persistence/typeorm";

/**
 * TODO
 */
export class FingerprintRepository extends TypeORMRepository<
    FingerprintEntity,
    string
> implements IFingerprintRepository {
    protected entityClass = FingerprintEntity;

    constructor(persistenceController: TypeORMPersistenceController) {
        super(persistenceController, "fingerprints");
    }

    public async getFingerprints(
        profile: Promisable<Profile>,
    ): Promise<IFingerprint[]> {
        const entity = await this.findByPrimaryKey((await profile).userID);
        return entity ? entity.fingerprints : [];
    }
}
