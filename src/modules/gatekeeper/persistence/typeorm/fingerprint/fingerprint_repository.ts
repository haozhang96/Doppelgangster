// Import internal components.
import { Promisable } from "@/common/types";
import { Profile } from "@/core/heuristic/profile";
import { IFingerprint } from "@/modules/gatekeeper/interfaces";
import {
    IFingerprintRepository,
} from "@/modules/gatekeeper/persistence/base/fingerprint";
import {
    FingerprintEntity,
// tslint:disable-next-line: max-line-length
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint/fingerprint_entity";
import { TypeORMRepository } from "@/persistence/typeorm";

/**
 * TODO
 */
export class FingerprintRepository extends TypeORMRepository<
    FingerprintEntity,
    string
> implements IFingerprintRepository {
    public tableName = "fingerprints";
    public entityClass = FingerprintEntity;

    public async getFingerprints(
        profile: Promisable<Profile>,
    ): Promise<IFingerprint[]> {
        const entity = await this.findByPrimaryKey((await profile).userID);
        return entity ? entity.fingerprints : [];
    }
}
