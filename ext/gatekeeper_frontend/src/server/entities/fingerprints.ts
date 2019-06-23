// Import external libraries.
import * as $TypeORM from "typeorm";

// Define the fingerprints entity.
@$TypeORM.Entity()
export class Fingerprints {
    @$TypeORM.PrimaryGeneratedColumn()
    public _id!: $TypeORM.ObjectID;

    @$TypeORM.Column()
    public userID!: string;

    @$TypeORM.Column()
    public fingerprints!: object[];
}
