// Import internal components.
import { IFingerprint } from "@/modules/gatekeeper/interfaces";
import {
    IFingerprintEntity,
} from "@/modules/gatekeeper/persistence/base/fingerprint";
// tslint:disable-next-line: max-line-length
import FingerprintRepository from "@/modules/gatekeeper/persistence/typeorm/fingerprint/fingerprint_repository";
import { TypeORMEntity, TypeORMEntityPrimaryKey } from "@/persistence/typeorm";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
@$TypeORM.Entity("fingerprints")
export default class FingerprintEntity extends TypeORMEntity<
    FingerprintEntity,
    FingerprintRepository,
    string
> implements IFingerprintEntity {
    public primaryKey: TypeORMEntityPrimaryKey<FingerprintEntity> = "userID";

    @$TypeORM.PrimaryColumn({length: 64})
    public userID!: string;

    @$TypeORM.Column("simple-json")
    public fingerprints!: IFingerprint[];
}
