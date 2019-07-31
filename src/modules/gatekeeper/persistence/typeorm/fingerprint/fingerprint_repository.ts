// Import internal components.
import { Profile } from "@/core/heuristic/profile";
import { IFingerprint } from "@/modules/gatekeeper/interfaces";
import {
    IFingerprintRepository,
} from "@/modules/gatekeeper/persistence/base/fingerprint";
import {
    FingerprintEntity,
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint";
import { TypeORMRepository } from "@/persistence/typeorm";

export class FingerprintRepository extends TypeORMRepository<
    FingerprintEntity,
    string
> implements IFingerprintRepository {
    protected entityClass = FingerprintEntity;

    public async getFingerprints(profile: Profile): Promise<IFingerprint[]> {
        return (this.findByPrimaryKey("") as FingerprintEntity).
    }
}
