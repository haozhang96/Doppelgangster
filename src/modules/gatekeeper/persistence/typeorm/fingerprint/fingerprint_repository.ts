// Import internal components.
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

    public async getFingerprints(profile: Profile): Promise<IFingerprint[]> {
        const entity = await this.findByPrimaryKey(profile.userID);
        return entity ? entity.fingerprints : [];
    }
}
