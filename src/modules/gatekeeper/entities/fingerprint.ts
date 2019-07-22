// Import internal components.
import { IFingerprint } from "../interfaces";

// Import external libraries.
import * as $TypeORM from "typeorm";

// Define the entity.
@$TypeORM.Entity("fingerprints")
export class Fingerprint {
    @$TypeORM.PrimaryColumn({length: 64})
    public userID!: string;

    @$TypeORM.Column("simple-json")
    public fingerprints!: IFingerprint[];
}
