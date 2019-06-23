// Import external libraries.
import * as $TypeORM from "typeorm";

// Define the entity.
@$TypeORM.Entity("fingerprints")
export class Fingerprint {
    @$TypeORM.PrimaryColumn()
    public userID!: string;

    @$TypeORM.Column()
    public fingerprints!: object[];
}
