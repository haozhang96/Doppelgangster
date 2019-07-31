// tslint:disable: max-classes-per-file

// Import internal components.
import { IFingerprint } from "@/modules/gatekeeper/interfaces";
import {
    IFingerprintEntity,
} from "@/modules/gatekeeper/persistence/base/fingerprint";
import {
    FingerprintRepository,
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint";
import { TypeORMEntity, TypeORMEntityPrimaryKey } from "@/persistence/typeorm";

// Import external libraries.
import * as $TypeORM from "typeorm";

/**
 * TODO
 */
@$TypeORM.Entity("fingerprints")
export class FingerprintEntity extends TypeORMEntity<
    FingerprintEntity,
    FingerprintRepository,
    string
> implements IFingerprintEntity {
    @$TypeORM.PrimaryColumn({length: 64})
    public userID!: string;

    @$TypeORM.Column("simple-json")
    public fingerprints!: IFingerprint[];

    // Define the TypeORMEntity-specific properties.
    public primaryKey: TypeORMEntityPrimaryKey<FingerprintEntity> = "userID";
    // protected typeormEntity = new $TypeORM.BaseEntity();
}
